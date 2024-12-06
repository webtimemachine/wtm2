import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from './open-ai.service';

describe('OpenAIService', () => {
  let service: OpenAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAIService],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
