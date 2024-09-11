import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeDisplayNameInput {
  @ApiProperty()
  @IsNotEmpty()
  displayname: string;
}
