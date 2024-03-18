import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../common/services';
import { JwtContext } from '../../auth/interfaces';

import {
  UpdateUserDeviceInput,
  UpdateUserPreferencesInput,
  UserDto,
  UserPreferencesDto,
} from '../dtos';

import { plainToInstance } from 'class-transformer';
import { CompleteUserDevice, completeUserDeviceInclude } from '../types';
import { UserDeviceDto } from '../dtos/user-device.dto';
import { DeviceDto } from '../dtos/device.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  static completeUserToDto(user: User): UserDto {
    const userDto = plainToInstance(UserDto, user);
    return userDto;
  }

  static userDeviceToDto(
    jwtContext: JwtContext,
    userDevice: CompleteUserDevice,
  ): UserDeviceDto {
    const deviceDto = plainToInstance(DeviceDto, {
      ...userDevice.device,
      id: Number(userDevice.device.id),
    });

    const userDeviceDto = plainToInstance(UserDeviceDto, {
      ...userDevice,
      id: Number(userDevice.id),
      userId: Number(userDevice.userId),
      deviceId: Number(userDevice.deviceId),
      isCurrentDevice:
        userDevice.device.deviceKey ===
        jwtContext.session.userDevice.device.deviceKey,
    });
    userDeviceDto.device = deviceDto;

    return userDeviceDto;
  }

  static userDevicesToDtos(
    jwtContext: JwtContext,
    userDevices: CompleteUserDevice[],
  ): UserDeviceDto[] {
    return userDevices.map((userDevice) =>
      UserService.userDeviceToDto(jwtContext, userDevice),
    );
  }

  async getMe(jwtContext: JwtContext): Promise<UserDto> {
    return UserService.completeUserToDto(jwtContext.user);
  }

  async getPreferences(jwtContext: JwtContext): Promise<UserPreferencesDto> {
    const userPreferencesDto = plainToInstance(
      UserPreferencesDto,
      jwtContext.user.userPreferences,
    );

    return userPreferencesDto;
  }

  async updatePreferences(
    jwtContext: JwtContext,
    updateUserPreferencesInput: UpdateUserPreferencesInput,
  ): Promise<UserPreferencesDto> {
    const { enableNavigationEntryExpiration, navigationEntryExpirationInDays } =
      updateUserPreferencesInput;

    const updatedUserPreferences =
      await this.prismaService.userPreferences.update({
        where: {
          userId: jwtContext.user.id,
        },
        data: {
          enableNavigationEntryExpiration,
          navigationEntryExpirationInDays,
        },
      });

    const userPreferencesDto = plainToInstance(
      UserPreferencesDto,
      updatedUserPreferences,
    );

    return userPreferencesDto;
  }

  async getUserDevices(jwtContext: JwtContext): Promise<UserDeviceDto[]> {
    const userDevices: CompleteUserDevice[] =
      await this.prismaService.userDevice.findMany({
        where: {
          userId: jwtContext.user.id,
        },
        include: completeUserDeviceInclude,
      });

    return UserService.userDevicesToDtos(jwtContext, userDevices);
  }

  async getCurrentUserDevice(jwtContext: JwtContext): Promise<UserDeviceDto> {
    return UserService.userDeviceToDto(
      jwtContext,
      jwtContext.session.userDevice,
    );
  }

  async updateUserDevice(
    jwtContext: JwtContext,
    userDeviceId: number,
    updateUserPreferencesInput: UpdateUserDeviceInput,
  ): Promise<UserDeviceDto> {
    const { deviceAlias } = updateUserPreferencesInput;

    const userDevice: CompleteUserDevice =
      await this.prismaService.userDevice.update({
        where: {
          id: userDeviceId,
        },
        data: {
          deviceAlias,
        },
        include: completeUserDeviceInclude,
      });

    return UserService.userDeviceToDto(jwtContext, userDevice);
  }
}
