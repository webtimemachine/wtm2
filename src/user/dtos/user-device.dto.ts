import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { DeviceDto } from './device.dto';

@Exclude()
export class UserDeviceDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  deviceId: number;

  @ApiProperty()
  @Expose()
  isCurrentDevice: boolean;

  @ApiProperty()
  @Expose()
  deviceAlias: string;

  @ApiProperty({ type: () => DeviceDto })
  @Expose()
  device: DeviceDto;
}
