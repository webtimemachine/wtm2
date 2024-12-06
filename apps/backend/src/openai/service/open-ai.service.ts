import { Injectable } from '@nestjs/common';
import { WebTMLogger } from 'src/common/helpers/webtm-logger';
import { OpenAI } from '@langchain/openai';
import { appEnv } from 'src/config';
import { SummaryPromptResponse, SummaryPromptSchema } from '../types';
import { PROMPTS } from './open-ai.prompts';

@Injectable()
export class OpenAIService {
  private readonly logger = new WebTMLogger(OpenAIService.name);
  private readonly openAI: OpenAI = new OpenAI({
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

  /**
   * Generate a summary based on the provided prompt.
   * @param {string} prompt - The input prompt for the model.
   * @returns {Promise<SummaryPromptResponse>} - The generated summary.
   * @throws {Error} - If response parsing fails.
   */
  async generateEntrySummary(prompt: string): Promise<SummaryPromptResponse> {
    const formattedResult = await this.openAI.invoke([prompt]);
    const jsonParseFormattedResult = JSON.parse(formattedResult);

    const parsedData = SummaryPromptSchema.safeParse(jsonParseFormattedResult);

    if (!parsedData.success) {
      this.logger.error(`Failed to parse response: ${parsedData.error.errors}`);
      throw new Error('Failed to parse response');
    } else {
      return parsedData.data;
    }
  }

  /**
   * Generate captions for a list of images.
   * @param {string[]} images - An array of image URLs or base64 strings.
   * @returns {Promise<string[]>} - A promise that resolves to an array of captions.
   * @throws {Error} - If an unsupported image format is encountered.
   */
  async generateImageCaptions(images: string[]): Promise<string[]> {
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
            throw new Error(
              'Unsupported image format. Allowed formats: png, jpeg, gif, webp.',
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
      console.error('Error captioning image:', error);
      return [];
    }
  }
}
