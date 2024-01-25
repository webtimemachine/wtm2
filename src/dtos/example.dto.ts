import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ExampleDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ required: false })
  @Expose()
  text?: string;
}
