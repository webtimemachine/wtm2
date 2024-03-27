import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class PasswordRecoveryCheckDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(5, 60)
  @IsEmail()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  recoveryCode: string;
}
