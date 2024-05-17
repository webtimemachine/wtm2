import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
