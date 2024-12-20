import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
  GetNavigationEntryDto,
  DeleteNavigationEntriesDto,
  AddContextToNavigationEntryDto,
} from '../dtos';
import { NavigationEntryService } from '../services';

import {
  CronJobKey,
  JwtAccessToken,
  JwtRequestContext,
} from '../../auth/decorators';
import { JwtContext } from '../../auth/interfaces';

import {
  ApiForbiddenMessageResponse,
  ApiBadRequestMessageResponse,
  ApiInternalServerErrorMessageResponse,
  ApiPaginationResponse,
} from '../../common/decorators';
import { MessageResponse, PaginationResponse } from '../../common/dtos';
import { WebTMLogger } from '../../common/helpers/webtm-logger';

@ApiTags('Navigation Entry')
@Controller('navigation-entry')
export class NavigationEntryController {
  private readonly logger = new WebTMLogger(NavigationEntryController.name);

  constructor(private readonly navigationService: NavigationEntryService) {}

  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiOkResponse({
    status: 200,
    type: CompleteNavigationEntryDto,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Post('/')
  async createNavigationEntry(
    @Body() createNavigationEntryInputDto: CreateNavigationEntryInputDto,
    @JwtRequestContext() context: JwtContext,
  ): Promise<void> {
    return this.navigationService.createNavigationEntry(
      context,
      createNavigationEntryInputDto,
    );
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiOkResponse({
    status: 200,
    type: CompleteNavigationEntryDto,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Post('/add-context')
  async addContextToNavigationEntry(
    @Body() addContextToNavigationEntryDto: AddContextToNavigationEntryDto,
    @JwtRequestContext() context: JwtContext,
  ): Promise<void> {
    return this.navigationService.addContextToNavigationEntry(
      context,
      addContextToNavigationEntryDto,
    );
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiPaginationResponse(CompleteNavigationEntryDto)
  @JwtAccessToken([])
  @HttpCode(200)
  @Get('/')
  getNavigationEntry(
    @JwtRequestContext() context: JwtContext,
    @Query() queryParams: GetNavigationEntryDto,
  ): Promise<PaginationResponse<CompleteNavigationEntryDto>> {
    return this.navigationService.getNavigationEntry(context, queryParams);
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiOkResponse({
    type: MessageResponse,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Delete('/:id')
  deleteNavigationEntry(
    @Param('id', ParseIntPipe) id: number,
    @JwtRequestContext() context: JwtContext,
  ): Promise<MessageResponse> {
    return this.navigationService.deleteNavigationEntry(context, id);
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiForbiddenMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiOkResponse({
    type: MessageResponse,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Delete('/')
  deleteNavigationEntries(
    @Body() deleteNavigationEntriesDto: DeleteNavigationEntriesDto,
    @JwtRequestContext() context: JwtContext,
  ): Promise<MessageResponse> {
    return this.navigationService.deleteNavigationEntries(
      context,
      deleteNavigationEntriesDto,
    );
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiOkResponse()
  @CronJobKey()
  @HttpCode(200)
  @Get('/expired')
  deleteExpiredNavigationEntries(): Promise<void> {
    return this.navigationService.deleteExpiredNavigationEntries();
  }
}
