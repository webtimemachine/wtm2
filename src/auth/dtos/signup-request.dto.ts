import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/constants';
import { ValidationMessages } from '../../common/enums';

export class SignUpRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message: ValidationMessages.PASSWORD,
  })
  password: string;
}
