import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDeviceDto } from '../../user/dtos/user-device.dto';

@Exclude()
export class CompleteNavigationEntryDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  navigationDate: Date;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  userDeviceId: number;

  @ApiProperty({ type: () => UserDeviceDto })
  @Expose()
  userDevice: UserDeviceDto;

  @ApiProperty({ required: false })
  @Expose()
  expirationDate?: Date;
}
