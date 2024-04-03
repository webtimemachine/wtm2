import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class InitiatePasswordRecoveryDto {
  @ApiProperty()
  @IsEmail()
  @Length(5, 60)
  email: string;
}
