import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetVersionResponse } from './dtos';

import { CustomLogger } from './common/helpers/custom-logger';

@ApiTags('Root')
@Controller()
export class AppController {
  private readonly logger: CustomLogger = new CustomLogger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('/version')
  @ApiOkResponse({
    status: 200,
    type: GetVersionResponse,
    isArray: true,
  })
  getVersion() {
    return this.appService.getVersion();
  }
}
