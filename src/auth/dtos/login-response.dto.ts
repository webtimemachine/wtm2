import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';
import { UserDeviceDto } from '../../user/dtos/user-device.dto';

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @ApiProperty({ type: UserDeviceDto })
  @Type(() => UserDeviceDto)
  userDevice: UserDeviceDto;
}
