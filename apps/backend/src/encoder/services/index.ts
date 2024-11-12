import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { WeaviateLibArgs, WeaviateStore } from '@langchain/weaviate';
import { Injectable } from '@nestjs/common';
import weaviate from 'weaviate-ts-client';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';
import { caption } from '../utils';
import { SemanticSearchResult } from '../types';
import { CustomLogger } from '../../common/helpers/custom-logger';
import { z } from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const TagsSchema = z.object({
  tags: z.array(z.string()).nonempty(),
});
const client = weaviate.client({
  scheme: appEnv.WEAVIATE_SCHEME,
  host: appEnv.WEAVIATE_HOST,
  apiKey: appEnv.WEAVIATE_HOST.includes('localhost')
    ? undefined
    : new weaviate.ApiKey(appEnv.WEAVIATE_API_KEY),
});

@Injectable()
export class IndexerService {
  private readonly logger = new CustomLogger(IndexerService.name);
  private readonly multitenantCollection = 'MultiTenancyCollection';

  constructor(private readonly prismaService: PrismaService) {}
  private readonly model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
    modelName: 'gpt-4o-mini',
  });

  private readonly tagExtractionPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `
      You are an expert extractor of relevant entities and tags from content. Your primary goal is to extract distinct and specific objects or entities mentioned in the input text, such as proper nouns, notable concepts, products, locations, or unique terms. Your tags should represent the most important and distinguishing features of the content.

      # Steps
      1. Analyze the input to identify specific nouns, proper names, or terms that represent core elements of the content.
      2. Extract up to **8 key tags** from the input, ensuring they represent unique or important entities found within the text.
      3. Ensure that **at least one of the tags is a specific date**, inferred from the context or set to today if no date is provided.

      # OUTPUT INSTRUCTIONS
      - **Format**: Output a JSON object containing an array of tags.
      - **Structure**: The array must be contained in a property named tags.
      - **Maximum Tags**: Extract **up to 8 tags**.
      - **Translation Requirement**: Ensure **all tags are in English**. If any tag is in a different language, translate it to English.
      - **Last Tag**: The **last tag** in the array must be a date, using the format DD/MM/YYYY. Assume today's date is ${new Date().toLocaleDateString('en-GB')} if no date is provided.
      `,
    ],
    ['human', '{content}'],
  ]);

  private async extractTags(content: string): Promise<string[]> {
    const chain = this.tagExtractionPrompt.pipe(this.model);
    try {
      const response = await chain.invoke({ content: content });

      const contentResponse =
        typeof response.content === 'string'
          ? response.content
          : (response.content?.join(' ') ?? '');

      const cleanedResponse = contentResponse.replace(/```(json)?/g, '').trim();

      const jsonData = JSON.parse(cleanedResponse);
      const parsedData = TagsSchema.parse(jsonData);
      return parsedData.tags;
    } catch (error) {
      this.logger.error('Failed to extract tags', error);
      throw new Error('Failed to extract tags from content.');
    }
  }

  private async vectorStoreArgs(userId: bigint): Promise<WeaviateLibArgs> {
    try {
      await client.schema
        .classCreator()
        .withClass({
          class: this.multitenantCollection,
          properties: [
            {
              name: 'tags',
              dataType: ['number[]'],
            },
            {
              name: 'summary',
              dataType: ['text'],
            },
            {
              name: 'url',
              dataType: ['text'],
            },
            {
              name: 'userId',
              dataType: ['text'],
            },
          ],
          multiTenancyConfig: { enabled: true },
          vectorIndexConfig: {
            efConstruction: 512,
            invertedIndexConfig: {
              bm25: {
                b: 0.75,
                k1: 1.2,
              },
            },
          },
        })
        .do();
      this.logger.log('Creating main multitenancy collection');
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (
          !(
            e.message.includes('class') &&
            (e.message.includes('already exists') ||
              e.message.includes('already exits'))
          )
        )
          throw e;
      } else throw e;
    }

    await client.schema
      .tenantsCreator(this.multitenantCollection, [
        { name: `Tenant-${userId}` },
      ])
      .do();

    return {
      client: client,
      indexName: this.multitenantCollection,
      metadataKeys: ['url'],
      textKey: 'text',
      tenant: `Tenant-${userId}`,
    };
  }

  async index(
    content: string,
    images: string[],
    url: string,
    userId: bigint,
    enableImageEncoding: boolean,
  ) {
    const exist =
      (await this.prismaService.navigationEntry.count({
        where: { url: url, userId: userId },
      })) > 0;

    if (!exist) {
      let tags: string[] = [];

      const tenants = await client.schema
        .tenantsGetter(this.multitenantCollection)
        .do();
      const tenantExists = tenants?.some(
        (t: any) => t.name === `Tenant-${userId}`,
      );

      if (!tenantExists) {
        try {
          await client.schema
            .tenantsCreator(this.multitenantCollection, [
              { name: `Tenant-${userId}` },
            ])
            .do();
          this.logger.debug(`Tenant-${userId} creado exitosamente`);
        } catch (e) {
          if (!(e instanceof Error && e.message.includes('already exists'))) {
            this.logger.error(`Error al crear el tenant: Tenant-${userId}`, e);
            throw e;
          }
        }
      }

      const contentTags = await this.extractTags(content);

      tags.push(...contentTags);

      if (enableImageEncoding) {
        this.logger.debug('Getting text embeddings of images');
        try {
          const imageTags = await Promise.all(
            images.map(async (image) => {
              const captionResult = await caption(image);
              const tagsFromImage = await this.extractTags(captionResult);
              return tagsFromImage;
            }),
          );
          imageTags.forEach((tagArray) => {
            tags.push(...tagArray);
          });
        } catch (error) {
          this.logger.warn(error);
        }
      }

      // Unificar todos los tags en una única cadena antes de generar el embedding
      const unifiedTags = tags.join(' ');

      const embeddingsGenerator = new OpenAIEmbeddings({
        modelName: 'text-embedding-3-large',
        openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
      });

      const embedding = await embeddingsGenerator.embedQuery(unifiedTags);

      await client.data
        .creator()
        .withClassName('MultiTenancyCollection')
        .withTenant(`Tenant-${userId}`)
        .withProperties({
          documentId: `User-${userId}-${Date.now()}`,
          summary: content,
          url: url,
          userId: userId.toString(),
        })
        .withVector(embedding)
        .do();

      this.logger.debug(`Data of ${url} successfully indexed with tags`);
    } else {
      this.logger.debug(`'${url}' was already indexed. Ignoring...`);
    }
  }

  async search(query: string, userId: bigint): Promise<SemanticSearchResult> {
    try {
      console.log(query, userId);

      const queryTags = await this.extractTags(query);
      if (queryTags.length === 0) {
        throw new Error('No tags were extracted from the search query.');
      }
      console.log('Extracted Tags:', queryTags);

      const unifiedTags = queryTags.join(' ');
      console.log(unifiedTags);
      const embeddingsGenerator = new OpenAIEmbeddings({
        modelName: 'text-embedding-3-large',
        openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
      });
      const queryEmbedding = await embeddingsGenerator.embedQuery(unifiedTags);
      console.log('Embedding for tags:', queryEmbedding);
      let attempts = 15;
      let reduceConstant = 0.02;
      let certainty = 1;
      let searchResults;
      while (attempts > 0) {
        certainty = certainty - reduceConstant;
        searchResults = await client.graphql
          .get()
          .withClassName(this.multitenantCollection)
          .withTenant(`Tenant-${userId}`)
          .withFields('url summary')
          .withNearVector({
            vector: queryEmbedding,
            certainty: certainty,
          })
          .withLimit(50)
          .do();
        console.log(certainty);
        if (searchResults.data?.Get?.[this.multitenantCollection].length > 10) {
          break;
        }

        attempts -= 1;
      }
      console.log('Search Results:', searchResults);

      const mostRelevantResults = new Map<string, string>();
      const urls = new Set<string>();
      if (searchResults.data?.Get?.[this.multitenantCollection]) {
        searchResults.data.Get[this.multitenantCollection].forEach(
          (result: any) => {
            const url = result.url;
            const summary = result.summary;

            if (!mostRelevantResults.has(url)) {
              mostRelevantResults.set(url, summary);
            }
            urls.add(url);
          },
        );
      }

      return {
        urls,
        mostRelevantResults,
      };
    } catch (error) {
      this.logger.error('Error while performing search', error);
      throw new Error('Failed to perform semantic search.');
    }
  }

  async delete(url: string, userId: bigint) {
    const urlEntriesCount = await this.prismaService.navigationEntry.count({
      where: { url: url, userId: userId },
    });
    // perform chunks/documents deletion only if the entry is the last one related to that URL
    if (urlEntriesCount == 1) {
      const store = await WeaviateStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
        await this.vectorStoreArgs(userId),
      );

      // remove the chunks/documents related to the given URL
      store.delete({
        filter: {
          where: {
            operator: 'Equal',
            path: ['url'],
            valueText: url,
          },
        },
      });
    }
  }

  async bulkDelete(urls: string[], userId: bigint) {
    const store = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
      await this.vectorStoreArgs(userId),
    );

    store.delete({
      filter: {
        where: {
          operator: 'ContainsAll',
          path: ['url'],
          valueTextArray: urls,
        },
      },
    });
  }
}
