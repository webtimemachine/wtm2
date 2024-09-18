import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';

import { UserDeviceDto } from '../../user/dtos/user-device.dto';

@Exclude()
export class CompleteSessionDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userDeviceId: number;

  @ApiProperty()
  @Expose()
  expiration: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  updateAt?: Date;

  @ApiProperty({ type: () => UserDeviceDto })
  @Expose()
  userDevice: UserDeviceDto;
}
