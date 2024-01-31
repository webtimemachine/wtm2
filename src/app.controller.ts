import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreateExampleInput, ExampleDto } from './dtos';
import { ApiBadRequestMessageResponse } from './common/decorators';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiProperty()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/example')
  @ApiProperty()
  @ApiResponse({
    status: 200,
    type: ExampleDto,
    isArray: true,
  })
  getExampleEntries() {
    return this.appService.getExampleEntries();
  }

  @Post('/example')
  @ApiProperty()
  @ApiBadRequestMessageResponse()
  createExampleEntry(@Body() body: CreateExampleInput) {
    return this.appService.createExampleEntry(body.text);
  }
}
