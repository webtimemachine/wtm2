import { OpenAIEmbeddings } from '@langchain/openai';
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
    return {
      urls,
      mostRelevantResults,
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
