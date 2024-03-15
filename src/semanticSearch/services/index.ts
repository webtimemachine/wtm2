import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import weaviate from 'weaviate-ts-client';
import { WeaviateStore, WeaviateLibArgs } from '@langchain/weaviate';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { appEnv } from 'src/config';

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '.'],
});

const client = weaviate.client({
  scheme: appEnv.WEAVIATE_SCHEME,
  host: appEnv.WEAVIATE_HOST,
});

@Injectable()
export class SemanticProcessor {
  private readonly logger = new Logger(SemanticProcessor.name);
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
    } catch (e) {
      // the main multitenancy collection only can be created once, instead an error is thrown
      if (!e.message.includes('already exists')) throw e;
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

  async index(content: string, url: string, userId: bigint) {
    const exist =
      (await this.prismaService.navigationEntry.count({
        where: { url: url, userId: userId },
      })) > 0;
    if (!exist) {
      this.logger.log(`Indexing chunks of '${url}'`);
      const documents = await textSplitter.createDocuments(
        [content],
        [{ source: url }],
      );
      const documentChunks = await textSplitter.splitDocuments(documents);
      await WeaviateStore.fromDocuments(
        documentChunks,
        new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
        await this.vectorStoreArgs(userId),
      );
      this.logger.log(`Chunks of ${url} successfully indexed`);
    } else this.logger.log(`'${url}' was already indexed. Ignoring...`);
  }

  async search(query: string, userId: bigint): Promise<Set<string>> {
    const store = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
      await this.vectorStoreArgs(userId),
    );
    const retriever = store.asRetriever({ k: 5 });
    const relevantChunks = await retriever.getRelevantDocuments(query);
    return new Set(relevantChunks.map((chunk) => chunk.metadata['source']));
  }
}
