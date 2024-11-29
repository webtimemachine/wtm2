import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetVersionResponse } from './dtos';

import { WebTMLogger } from './common/helpers/webtm-logger';

@ApiTags('Root')
@Controller()
export class AppController {
  private readonly logger: WebTMLogger = new WebTMLogger(AppController.name);

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
