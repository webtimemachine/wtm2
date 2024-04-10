import { Controller, Get, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAccessToken } from './auth/decorators';

@ApiTags('Root')
@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiProperty()
  @JwtAccessToken([])
  getHello() {
    return this.appService.getHello();
  }
}
