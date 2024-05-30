import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserPreferencesInput {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableNavigationEntryExpiration?: boolean;

  @ApiProperty({ type: 'number', nullable: true, required: false })
  @IsOptional()
  @IsNumber()
  navigationEntryExpirationInDays?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableImageEncoding: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableExplicitContentFilter: boolean;
}
