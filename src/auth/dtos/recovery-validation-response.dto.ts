import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecoveryValidationResponseDto {
  @Expose()
  @ApiProperty()
  recoveryToken: string;
}
