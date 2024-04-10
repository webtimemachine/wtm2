import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { GetPaginationsParamsDto } from '../../common/dtos';

export class GetQueriesDto extends GetPaginationsParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  query?: string;
}
