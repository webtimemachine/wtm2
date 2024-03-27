import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

const validationErrorMessage =
  'Password must contain at least one digit, one lowercase letter, one uppercase letter, and be between 8 and 20 characters in length.';

export class RecoverNewPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/, {
    message: validationErrorMessage,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/, {
    message: validationErrorMessage,
  })
  verificationPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim())
  deviceKey: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value || '').toString().trim())
  userAgent?: string = '';
}
