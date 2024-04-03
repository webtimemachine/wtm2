import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class PasswordRecoveryCheckDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  recoveryCode: string;
}
