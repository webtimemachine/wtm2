import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UserPreferencesDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  enableNavigationEntryExpiration: boolean;

  @ApiProperty({ type: 'number', nullable: true })
  @Expose()
  navigationEntryExpirationInDays: number | null;

  @ApiProperty()
  @Expose()
  enableImageEncoding: boolean;

  @ApiProperty()
  @Expose()
  enableExplicitContentFilter: boolean;
}
