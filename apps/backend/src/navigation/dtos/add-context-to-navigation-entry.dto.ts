import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddContextToNavigationEntryDto {
  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  content: string;
}
