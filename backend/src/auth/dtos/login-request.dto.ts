import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

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
