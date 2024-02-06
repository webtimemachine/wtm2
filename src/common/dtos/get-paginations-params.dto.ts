import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Max, IsPositive, Min } from 'class-validator';

export class GetPaginationsParamsDto {
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(50)
  @Type(() => Number)
  limit: number = 10;
}
