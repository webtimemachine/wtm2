import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LogoutSessionInputDto {
  @ApiProperty()
  @IsNumber()
  sessionId: number;
}
