import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateExampleInput {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim())
  text: string;
}
