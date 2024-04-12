import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetVersionReseponse } from './dtos';

@ApiTags('Root')
@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('/version')
  @ApiOkResponse({
    status: 200,
    type: GetVersionReseponse,
    isArray: true,
  })
  getVersion() {
    return this.appService.getVersion();
  }
}
