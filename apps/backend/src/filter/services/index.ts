import {
  BaseOutputParser,
  OutputParserException,
} from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';
import { CustomLogger } from '../../common/helpers/custom-logger';
import { z } from 'zod';

const outputSchema = z.boolean();

export class FlagParser extends BaseOutputParser<boolean> {
  lc_namespace = ['langchain', 'output_parsers'];

  async parse(text: string): Promise<boolean> {
    const normalizedText = text.toLowerCase().trim();

    if (normalizedText != 'true' && normalizedText != 'false') {
      throw new OutputParserException(
        `Failed to parse: ${text}. Expected "true" or "false".`,
      );
    }

    const result = normalizedText === 'true';
    outputSchema.parse(result);

    return result;
  }

  getFormatInstructions(): string {
    return 'Your response must be either "true" or "false".';
  }
}

const outputParser = new FlagParser();

const filterPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `
    # Explicit Content Detection

    ## Description
      Analyze the provided content to determine if it contains explicit material.

    ## Task
      Explicit content is defined as material related to pornography, escort services, or sexually suggestive themes.  
      If the content appears in a news or informational format, it should be classified as non-explicit.

    ## Response Format
      - Respond with **"true"** if the content is explicit.
      - Respond with **"false"** if it is not.
      - Do not include explanations or additional information.

    ## Examples

      ### Example 1
        **Input:**  
          "This is an article discussing the rise of adult content on streaming platforms."  

        **Output:**  
          "false"

      ### Example 2
        **Input:**  
          "A website promoting escort services with explicit imagery."  

        **Output:**  
          "true"
    `,
  ],
  ['human', '{content}'],
]);

@Injectable()
export class ExplicitFilterService {
  private readonly logger = new CustomLogger(ExplicitFilterService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private readonly model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
    modelName: 'gpt-4o-mini',
  });

  private async isExplicit(content: string): Promise<boolean> {
    const chain = filterPrompt.pipe(this.model).pipe(outputParser);

    try {
      return await chain.invoke({ content });
    } catch (error) {
      this.logger.error('Error parsing explicit content result', error);
      throw new OutputParserException(
        'Error while parsing content for explicit material.',
      );
    }
  }

  async filter(content: string, url: string) {
    let hasExplicitContent =
      (await this.prismaService.blackList.count({
        where: { url },
      })) > 0;

    try {
      if (!hasExplicitContent) {
        if (content.length <= 128000 && (await this.isExplicit(content))) {
          await this.prismaService.blackList.create({
            data: { url },
          });
          hasExplicitContent = true;
        }
      }
    } catch (error) {
      this.logger.error('Error while checking explicit content', error);
      return;
    }

    if (hasExplicitContent) {
      throw new HttpException(
        'Content contains explicit material',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
