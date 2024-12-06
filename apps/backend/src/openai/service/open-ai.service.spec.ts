import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from './open-ai.service';
// import { WebTMLogger } from 'src/common/helpers/webtm-logger';
import { OpenAI } from '@langchain/openai';
import { appEnv } from 'src/config';
// import { SummaryPromptResponse, SummaryPromptSchema } from '../types';
// import { PROMPTS } from './open-ai.prompts';

jest.mock('@langchain/openai');
jest.mock('src/common/helpers/webtm-logger');

describe('OpenAIService', () => {
  let service: OpenAIService;
  let openAIMock: jest.Mocked<OpenAI>;
  let captionerModelMock: jest.Mocked<OpenAI>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAIService],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
    openAIMock = new OpenAI({
      openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
      modelName: 'gpt-4o-mini',
      temperature: 0.8,
    }) as jest.Mocked<OpenAI>;
    captionerModelMock = new OpenAI({
      modelName: 'gpt-4o',
      maxTokens: 256,
      temperature: 0,
      openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
    }) as jest.Mocked<OpenAI>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateEntrySummary', () => {
    it('should generate a summary successfully', async () => {
      const prompt = 'Test prompt';
      const resultMock = {
        data: {
          content: 'Test content',
          source: 'Test source',
          tags: ['Test tag'],
        },
      };
      const formattedResult = JSON.stringify(resultMock);
      openAIMock.invoke.mockResolvedValueOnce(formattedResult);

      const result = await service.generateEntrySummary(prompt);

      expect(result).toEqual(resultMock);
    });

    it('should throw an error if response parsing fails', async () => {
      const prompt = 'Test prompt';
      const formattedResult = 'Invalid JSON';
      openAIMock.invoke.mockResolvedValueOnce(formattedResult);

      await expect(service.generateEntrySummary(prompt)).rejects.toThrow(
        'Failed to generate summary',
      );
    });
  });

  describe('generateImageCaptions', () => {
    it('should generate captions for images successfully', async () => {
      const images = ['data:image/png;base64,test'];
      const caption = 'Test caption';
      captionerModelMock.invoke.mockResolvedValueOnce(caption);

      const result = await service.generateImageCaptions(images);

      expect(result).toEqual([caption]);
    });

    it('should throw an error for unsupported image format', async () => {
      const images = ['data:image/unsupported;base64,test'];

      await expect(service.generateImageCaptions(images)).rejects.toThrow(
        'Unsupported image format. Allowed formats: png, jpeg, gif, webp.',
      );
    });
  });
});
