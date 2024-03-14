import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import weaviate from 'weaviate-ts-client';
import { WeaviateStore, WeaviateLibArgs } from '@langchain/weaviate';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { appEnv } from 'src/config';

const GOOGLE_PREFIX = 'https://www.google.com/search?q';

const weaviateArgs: WeaviateLibArgs = {
  client: weaviate.client({
    scheme: appEnv.WEAVIATE_SCHEME,
    host: appEnv.WEAVIATE_HOST,
  }),
  indexName: 'WtmIndex',
  metadataKeys: ['source'],
  textKey: 'text',
};

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '.'],
});

@Injectable()
export class SemanticProcessor {
  private readonly logger = new Logger(SemanticProcessor.name);

  constructor(private readonly prismaService: PrismaService) {}

  async index(content: string, url: string) {
    if (url.startsWith(GOOGLE_PREFIX)) {
      this.logger.log('Ignoring google search content');
      return;
    }
    const exist =
      (await this.prismaService.navigationEntry.findFirst({
        where: { url: url },
      })) !== null;
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
        weaviateArgs,
      );
      this.logger.log(`Chunks of ${url} successfully indexed`);
    } else this.logger.log(`'${url}' was already indexed. Ignoring...`);
  }

  async search(query: string): Promise<Set<string>> {
    const store = await WeaviateStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN }),
      weaviateArgs,
    );
    const retriever = store.asRetriever({ k: 5 });
    const relevantChunks = await retriever.getRelevantDocuments(query);
    return new Set(relevantChunks.map((chunk) => chunk.metadata['source']));
  }
}
