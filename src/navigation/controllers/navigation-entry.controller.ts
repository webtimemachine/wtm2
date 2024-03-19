import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessToken, JwtRequestContext } from 'src/auth/decorators';
import { JwtContext } from 'src/auth/interfaces';
import {
  ApiBadRequestMessageResponse,
  ApiInternalServerErrorMessageResponse,
  ApiPaginationResponse,
} from 'src/common/decorators';
import { MessageResponse, PaginationResponse } from 'src/common/dtos';
import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
} from '../dtos';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { NavigationEntryService } from '../services';
import { ExplicitFilterService } from '../../filter/services';

@ApiTags('Navigation Entry')
@Controller('navigation-entry')
export class NavigationEntryController {
  private readonly logger = new Logger(NavigationEntryController.name);
  constructor(
    private readonly navigationService: NavigationEntryService,
    private readonly explicitFilter: ExplicitFilterService,
  ) {}

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
  ): Promise<CompleteNavigationEntryDto> {
    if (
      await this.explicitFilter.filter(createNavigationEntryInputDto.content!)
    ) {
      throw new HttpException(
        'Content contains explicit material',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
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
