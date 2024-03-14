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
  @ApiProperty({ required: true })
  @IsBoolean()
  @Transform(({ value }) => {
    // a transform function was provided because `IsBoolean` didn't work properly
    return value === 'true' ? true : false;
  })
  isSemantic: boolean;
}
