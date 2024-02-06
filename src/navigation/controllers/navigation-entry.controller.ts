import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NavigationEntryService } from '../services';
import { CreateNavigationEntryInputDto, NavigationEntryDto } from '../dtos';
import {
  ApiBadRequestMessageResponse,
  ApiInternalServerErrorMessageResponse,
} from 'src/common/decorators';
import { JwtAccessToken, JwtRequestContext } from 'src/auth/decorators';
import { JwtContext } from 'src/auth/interfaces';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { PaginationResponse } from 'src/common/dtos';
import { ApiPaginationResponse } from 'src/common/decorators';

@ApiTags('Navigation Entry')
@Controller('navigation-entry')
export class NavigationEntryController {
  constructor(private readonly navigationService: NavigationEntryService) {}

  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiOkResponse({
    status: 200,
    type: NavigationEntryDto,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Post('/')
  createNavigationEntry(
    @Body() createNavigationEntryInputDto: CreateNavigationEntryInputDto,
    @JwtRequestContext() context: JwtContext,
  ): Promise<NavigationEntryDto> {
    return this.navigationService.createNavigationEntry(
      context,
      createNavigationEntryInputDto,
    );
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiPaginationResponse(NavigationEntryDto)
  @JwtAccessToken([])
  @HttpCode(200)
  @Get('/')
  getNavigationEntry(
    @JwtRequestContext() context: JwtContext,
    @Query() queryParams: GetNavigationEntryDto,
  ): Promise<PaginationResponse<NavigationEntryDto>> {
    return this.navigationService.getNavigationEntry(context, queryParams);
  }
}
