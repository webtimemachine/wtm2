import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QueryService } from '../services';
import { QueryResultDto, GetQueriesDto } from '../dtos/';

import {
  ApiInternalServerErrorMessageResponse,
  ApiPaginationResponse,
} from '../../common/decorators';
import { PaginationResponse } from '../../common/dtos';

import { JwtAccessToken, JwtRequestContext } from '../../auth/decorators';
import { JwtContext } from '../../auth/interfaces';

@ApiTags('Query')
@Controller('queries')
export class QueyController {
  constructor(private readonly queryService: QueryService) {}

  @ApiInternalServerErrorMessageResponse()
  @ApiPaginationResponse(QueryResultDto)
  @JwtAccessToken([])
  @HttpCode(200)
  @Get('/')
  getQueries(
    @JwtRequestContext() context: JwtContext,
    @Query() queryParams: GetQueriesDto,
  ): Promise<PaginationResponse<QueryResultDto>> {
    return this.queryService.getQueries(context, queryParams);
  }
}
