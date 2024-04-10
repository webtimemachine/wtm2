import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetHelloReseponse {
  @ApiProperty()
  @Expose()
  message: string;
}
