import { WebTMLogger } from '../../common/helpers/webtm-logger';
import { Injectable } from '@nestjs/common';
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
}
