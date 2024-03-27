import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecoveryResponseDto {
  @Expose()
  @ApiProperty()
  recoveryToken: string;
}
