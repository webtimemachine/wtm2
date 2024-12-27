import { Injectable } from '@nestjs/common';
import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { WebTMLogger } from '../../common/helpers/webtm-logger';
import { SummaryPromptResponse, SummaryPromptSchema } from '../types';
import { PROMPTS } from './open-ai.prompts';
import { FlagParser } from '../utils';
import { appEnv } from '../../config';

@Injectable()
export class OpenAIService {
  private readonly logger = new WebTMLogger(OpenAIService.name);
  private readonly chatModel: ChatOpenAI = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
    modelName: 'gpt-4o-mini',
  });
  private readonly model: OpenAI = new OpenAI({
    openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
    modelName: 'gpt-4o-mini',
    temperature: 0.8,
  });
  private readonly captionerModel = new OpenAI({
    modelName: 'gpt-4o',
    maxTokens: 256,
    temperature: 0,
    openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
  });
  private readonly allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
  ];
  private readonly outputParser = new FlagParser();

  /**
   * Generate a summary based on the provided prompt.
   * @param {string} prompt - The input prompt for the model.
   * @returns {Promise<SummaryPromptResponse>} - The generated summary.
   * @throws {Error} - If response parsing fails.
   */
  async generateEntrySummary(prompt: string): Promise<SummaryPromptResponse> {
    try {
      const formattedResult = await this.model.invoke([prompt]);
      const jsonParseFormattedResult = JSON.parse(formattedResult);
      const finalJsonParsed = {
        data: {
          content:
            jsonParseFormattedResult?.data?.content ||
            jsonParseFormattedResult?.content,
          tags:
            jsonParseFormattedResult?.data?.tags ||
            jsonParseFormattedResult?.tags,
          source:
            jsonParseFormattedResult?.data?.source ||
            jsonParseFormattedResult?.source,
        },
      };

      const parsedData = SummaryPromptSchema.safeParse(finalJsonParsed);

      if (!parsedData.success) {
        const error = `Failed to parse response: \n${parsedData.error.errors.map(
          (error) => {
            return `- Error Code:${error.code} | Error Message: ${error.message} | Is Fatal: ${error.fatal || 'Non Fatal'} | Path: ${error.path} \n`;
          },
        )}JSON Result: ${JSON.stringify(jsonParseFormattedResult)}`;
        this.logger.error(error);
        throw new Error(error);
      } else {
        return parsedData.data;
      }
    } catch (error) {
      this.logger.error(`Failed to generate summary: ${error}`);
      throw new Error('Failed to generate summary');
    }
  }

  /**
   * Generate captions for a list of images.
   * @param {string[]} images - An array of image URLs or base64 strings.
   * @returns {Promise<string[]>} - A promise that resolves to an array of captions.
   * @throws {Error} - If an unsupported image format is encountered.
   */
  async generateImageCaptions(
    images: string[],
    hostname: string,
  ): Promise<string[]> {
    try {
      const captions = await Promise.all(
        images.map(async (img) => {
          let mimeType: string | null = null;

          if (img.startsWith('data:')) {
            mimeType = img.substring(5, img.indexOf(';'));
          } else if (img.startsWith('http')) {
            const response = await fetch(img, { method: 'HEAD' });
            mimeType = response.headers.get('content-type');
          }

          if (!mimeType || !this.allowedMimeTypes.includes(mimeType)) {
            const reason = mimeType
              ? !this.allowedMimeTypes.includes(mimeType)
                ? 'Not an allowed Mime Type'
                : null
              : 'No Mime Type provided on image url.';
            throw new Error(
              `Unsupported image format. Allowed formats: png, jpeg, gif, webp.\nSource: ${hostname}\nImage Type Provided: ${mimeType}\nReason: ${reason}`,
            );
          }

          const response = await this.captionerModel.invoke([
            PROMPTS.imageCaption(img),
          ]);

          return response;
        }),
      );

      return captions;
    } catch (error) {
      this.logger.error('Error captioning image:', error);
      throw error;
    }
  }

  async checkForExplicitContent(content: string): Promise<boolean> {
    const chain = PROMPTS.explicitFilter()
      .pipe(this.chatModel)
      .pipe(this.outputParser);

    try {
      return await chain.invoke({ content });
    } catch (error) {
      this.logger.error('Error parsing explicit content result');
      this.logger.error(error);
      throw error;
    }
  }
}
