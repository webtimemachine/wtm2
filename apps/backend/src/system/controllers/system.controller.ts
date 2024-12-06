import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { SystemService } from '../services';
import { GetVersionResponse } from '../dtos';

@ApiTags('System')
@Controller('')
export class SystemController {
  constructor(
    private readonly systemService: SystemService,
    private readonly health: HealthCheckService,
  ) {}

  @Get('/health')
  @HealthCheck()
  checkRoot() {
    return this.health.check([]);
  }

  @Get('/system/health')
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  @Get('/system/version')
  @ApiOkResponse({
    status: 200,
    type: GetVersionResponse,
  })
  getVersion(): GetVersionResponse {
    return this.systemService.getVersion();
  }

  @Get('/system/models')
  allModelsInformation() {
    return this.systemService.getModelsInformation();
  }
}
