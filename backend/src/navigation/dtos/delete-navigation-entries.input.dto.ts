import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteNavigationEntriesDto {
  @ApiProperty({ isArray: true, example: '[143,144,145,148]' })
  @IsNumber({}, { each: true })
  navigationEntryIds: number[];
}
