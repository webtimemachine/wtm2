import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNavigationEntryInputDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  content?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({
    message: 'must be a valid date in ISO 8601 date-time format',
  })
  @ApiProperty({})
  navigationDate: Date;
}
