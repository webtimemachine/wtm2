import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class GetVersionResponse {
  @ApiProperty({ example: '0.0.1' })
  @Expose()
  version: string;
}
