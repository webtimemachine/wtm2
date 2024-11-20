import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

import { GetPaginationsParamsDto } from '../../common/dtos';

export class GetNavigationEntryDto extends GetPaginationsParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  tag?: string;
}
