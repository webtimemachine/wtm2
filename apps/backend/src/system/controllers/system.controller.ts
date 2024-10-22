import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SystemService } from '../services';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('/models')
  allModelsInformation() {
    return this.systemService.getModelsInformation();
  }
}
