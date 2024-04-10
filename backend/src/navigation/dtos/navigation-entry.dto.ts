import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class NavigationEntryDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  content?: string;

  @ApiProperty()
  @Expose()
  navigationDate: Date;

  @ApiProperty({ required: false })
  @Expose()
  expirationDate?: Date;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  userAgent: string;
}
