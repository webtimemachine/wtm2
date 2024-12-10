import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WebTMLogger } from '../../common/helpers/webtm-logger';
import { getVersion } from '../../getVersion';
import { GetVersionResponse } from '../dtos';

@Injectable()
export class SystemService {
  private readonly logger = new WebTMLogger(SystemService.name);
  constructor() {}

  getModelsInformation() {
    const models = {
      text_processing_model: 'gpt-4o-mini',
      image_processing_model: 'gpt-4o-mini',
    };
    return models;
  }

  getVersion(): GetVersionResponse {
    const version = getVersion();
    return plainToInstance(GetVersionResponse, { version });
  }
}
