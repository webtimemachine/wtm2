import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

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

  @ApiProperty({ required: true })
  images: string[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({
    message: 'must be a valid date in ISO 8601 date-time format',
  })
  @ApiProperty({})
  navigationDate: Date;
}
