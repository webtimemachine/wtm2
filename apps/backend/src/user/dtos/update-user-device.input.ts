import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDeviceInput {
  @ApiProperty({ type: 'string', nullable: true, required: false })
  @IsOptional()
  @IsString()
  deviceAlias?: string | null;
}
