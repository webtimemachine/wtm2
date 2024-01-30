import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  id: number;

  @Expose()
  @ApiProperty({ required: false })
  email: string;
}
