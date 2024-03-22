import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PaginationResponse<T> {
  @Expose()
  @ApiProperty()
  offset: number;

  @Expose()
  @ApiProperty()
  limit: number;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  count: number;

  @Expose()
  @ApiProperty({ required: false })
  query?: string;

  @Expose()
  @ApiProperty()
  items: T[];
}
