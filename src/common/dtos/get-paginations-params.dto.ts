import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Max,
  IsPositive,
  Min,
  IsString,
  IsEnum,
} from 'class-validator';

export enum OrderingOrientation {
  ASC = 'asc',
  DESC = 'desc',
}

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  orderBy: string;

  @ApiProperty({
    enum: OrderingOrientation,
    enumName: 'OrderingOrientation',
    required: false,
    default: OrderingOrientation.ASC,
  })
  @IsEnum(OrderingOrientation, {
    message:
      'Invalid ordering orientation provided. Must be one of: asc or desc',
  })
  @IsOptional()
  order: OrderingOrientation = OrderingOrientation.ASC;
}
