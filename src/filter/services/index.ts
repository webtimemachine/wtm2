import {
  BaseOutputParser,
  OutputParserException,
} from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';

export class FlagParser extends BaseOutputParser<boolean> {
  lc_namespace = ['langchain', 'output_parsers'];
  async parse(text: string): Promise<boolean> {
    if (text.length != 4 && text.length != 5) {
      throw new OutputParserException(
        `Failed to parse: ${text}. Expected "true" or "false"`,
      );
    }
    return text.toLowerCase() === 'true' ? true : false;
  }
  getFormatInstructions(): string {
    return 'Your response must be either "true" or "false"';
  }
}

const outputParser = new FlagParser();

const filterPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a helpful assistant that analyzes the given content to determine whether it contains explicit content.\nExplicit content is limited to pornography, terrorism, drugs, and curse words.\n\nIf some of those are in news format, consider the content as non explicit.\nYou must answer either "true" or "false"',
  ],
  ['human', '{content}'],
]);

@Injectable()
export class ExplicitFilterService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
  });

  private async isExplicit(content: string): Promise<boolean> {
    const chain = filterPrompt.pipe(this.model).pipe(outputParser);
    return await chain.invoke({ content: content });
  }

  async filter(content: string, url: string, userId: bigint) {
    // check if the given URL has already been blacklisted
    let hasExplicitContent =
      (await this.prismaService.blackList.count({
        where: { url: url, userId: userId },
      })) > 0;

    if (!hasExplicitContent) {
      // invoke the LLM if the URL has not been blacklisted yet
      if (await this.isExplicit(content)) {
        // blacklist the URL
        await this.prismaService.blackList.create({
          data: { userId: userId, url: url },
        });
        hasExplicitContent = true;
      }
    }

    if (hasExplicitContent)
      throw new HttpException(
        'Content contains explicit material',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }
}
