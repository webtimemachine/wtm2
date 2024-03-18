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
import { NavigationEntryService } from '../services';
import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
} from '../dtos';
import {
  ApiBadRequestMessageResponse,
  ApiInternalServerErrorMessageResponse,
} from 'src/common/decorators';
import { JwtAccessToken, JwtRequestContext } from 'src/auth/decorators';
import { JwtContext } from 'src/auth/interfaces';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { MessageResponse, PaginationResponse } from 'src/common/dtos';
import { ApiPaginationResponse } from 'src/common/decorators';

@ApiTags('Navigation Entry')
@Controller('navigation-entry')
export class NavigationEntryController {
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
  createNavigationEntry(
    @Body() createNavigationEntryInputDto: CreateNavigationEntryInputDto,
    @JwtRequestContext() context: JwtContext,
  ): Promise<CompleteNavigationEntryDto> {
    return this.navigationService.createNavigationEntry(
      context,
      createNavigationEntryInputDto,
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
}
