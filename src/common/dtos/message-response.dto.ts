import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MessageResponse {
  @Expose()
  @ApiProperty({ required: false })
  statusCode?: number;

  @Expose()
  @ApiProperty({ required: false })
  message?: string;

  @Expose()
  @ApiProperty({ required: false })
  error?: string;
}
