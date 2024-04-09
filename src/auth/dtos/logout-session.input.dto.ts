import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LogoutSessionInputDto {
  @ApiProperty({ isArray: true })
  @IsNumber({}, { each: true })
  sessionIds: number[];
}
