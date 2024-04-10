import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SignUpRequestDto {
  static validationErrorMessage =
    'Password must contain at least one digit, one lowercase letter, one uppercase letter, and be between 8 and 20 characters in length.';

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/, {
    message: SignUpRequestDto.validationErrorMessage,
  })
  password: string;
}
