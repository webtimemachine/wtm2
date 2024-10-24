import { CustomLogger } from '../../common/helpers/custom-logger';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SystemService {
  private readonly logger = new CustomLogger(SystemService.name);
  constructor() {}

  getModelsInformation() {
    const models = {
      text_processing_model: 'gpt-4o-mini',
      image_processing_model: 'gpt-4o',
    };
    return models;
  }
}
