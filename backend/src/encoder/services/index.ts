import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { WeaviateLibArgs, WeaviateStore } from '@langchain/weaviate';
import { Document } from '@langchain/core/documents';
import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import weaviate from 'weaviate-ts-client';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';
import { caption } from '../utils';
import { SemanticSearchResult } from '../types';

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '.'],
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
  private readonly logger = new Logger(IndexerService.name);
  private readonly multitenantCollection = 'MultiTenancyCollection';

  constructor(private readonly prismaService: PrismaService) {}

  private async vectorStoreArgs(userId: bigint): Promise<WeaviateLibArgs> {
    try {
      await client.schema
        .classCreator()
        .withClass({
          class: this.multitenantCollection,
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
      // The main multitenant collection can only be created once; otherwise, an error is thrown
      if (e instanceof Error) {
        if (
          !(
            e.message.includes('class') &&
            (e.message.includes('already exists') ||
              // possible typo from library
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
      metadataKeys: ['source'],
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
      let extraDocuments: Document[] = [];
      if (enableImageEncoding) {
        this.logger.debug('Getting text embeddings of images');
        extraDocuments = await Promise.all(
          images.map(async (image) => {
            const captionResult = await caption(image);
            return new Document({
              pageContent: captionResult,
              metadata: { source: url },
            });
          }),
        );
      }
      this.logger.debug(`Indexing chunks of '${url}'`);
      const documents = await textSplitter.createDocuments(
        [content],
        [{ source: url }],
      );
      const documentChunks = await textSplitter.splitDocuments(documents);

      await WeaviateStore.fromDocuments(
        [...documentChunks, ...extraDocuments],
        new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
        await this.vectorStoreArgs(userId),
      );
      this.logger.debug(`Chunks of ${url} successfully indexed`);
    } else this.logger.debug(`'${url}' was already indexed. Ignoring...`);
  }

  async search(query: string, userId: bigint): Promise<SemanticSearchResult> {
    const store = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
      await this.vectorStoreArgs(userId),
    );
    const retriever = store.asRetriever({ k: 5 });
    const mostRelevantResults = new Map<string, string>();
    const urls = new Set<string>();
    const relevantChunks = await retriever.getRelevantDocuments(query);
    relevantChunks.forEach((chunk) => {
      urls.add(chunk.metadata['source']);
      if (!mostRelevantResults.has(chunk.metadata['source'])) {
        mostRelevantResults.set(chunk.metadata['source'], chunk.pageContent);
      }
    });

    const mostRelevantResultsPrettied = new Map<string, string>();
    const openai = new OpenAI({
      openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
      modelName: 'gpt-4o-mini',
      temperature: 0.8,
    });

    const promise = Array.from(mostRelevantResults.keys()).map(async (key) => {
      const value = mostRelevantResults.get(key);
      const formatPrompt = `
      # IDENTITY and PURPOSE

      You are an expert content summarizer. You take semantic markdown content in and output a Markdown formatted summary using the format below. Also, you are an expert code formatter in markdown, making code more legible and well formatted.

      Take a deep breath and think step by step about how to best accomplish this goal using the following steps.

      # OUTPUT SECTIONS

      - Combine all of your understanding of the content into a single, 20-word sentence in a section called Search Summary:.

      - Output the 10 if exists, including most important points of the content as a list with no more than 15 words per point into a section called Main Points:.

      - Output a list of the 5 best takeaways from the content in a section called Takeaways:.

      - Output code must be formatted with Prettier like.

      - Output a section named Code: that shows a list of code present in INPUT content in markdown

      - Output a section named Tags found: that shows in a list of tags you find

      # OUTPUT INSTRUCTIONS

      - Create the output using the formatting above.
      - You only output human readable Markdown.
      - Sections MUST be in capital case.
      - Sections must be h2 to lower.
      - Output numbered lists, not bullets.
      - Do not output warnings or notes—just the requested sections.
      - Do not repeat items in the output sections.
      - Do not start items with the same opening words.
      - Do not show Code: section if no code is present on input provided.
      - You must detect the type of code and add it to code block so markdown styles are applied.
      - Set codes proper language if you can detect it.
      - Detect code and apply format to it.
      - The wrapped tags must be tags that you find from page information.
      - Tags must be a link that redirects to source url.
      # INPUT:

      INPUT:

      The search result is:

      ### Source: ${key}
      ${value}
      `;
      const formattedResult = await openai.invoke([formatPrompt]);
      return { key: key, result: formattedResult };
    });
    const awaitedResults = await Promise.all(promise);
    for (const { key, result } of awaitedResults) {
      mostRelevantResultsPrettied.set(key, result);
    }

    return {
      urls,
      mostRelevantResults: mostRelevantResultsPrettied,
    };
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
            path: ['source'],
            valueText: url,
          },
        },
      });
    }
  }
}
