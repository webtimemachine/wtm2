import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RestorePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  verificationPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim())
  deviceKey: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value || '').toString().trim())
  userAgent?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value || '').toString().trim())
  userAgentData?: string = '';
}
