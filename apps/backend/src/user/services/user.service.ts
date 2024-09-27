import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

import { JwtContext } from '../../auth/interfaces';
import { PrismaService } from '../../common/services';

import {
  ChangePasswordInput,
  UpdateUserDeviceInput,
  UpdateUserPreferencesInput,
  UserDto,
  UserPreferencesDto,
  ChangeDisplayNameInput,
  ChangeProfilePictureInput,
} from '../dtos';

import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { MessageResponse } from '../../common/dtos';
import { DeviceDto } from '../dtos/device.dto';
import { UserDeviceDto } from '../dtos/user-device.dto';
import { CompleteUserDevice, completeUserDeviceInclude } from '../types';

import { UAParser } from 'ua-parser-js';
import { AuthService } from '../../auth/services';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  static completeUserToDto(user: User): UserDto {
    const userDto = plainToInstance(UserDto, user);
    return userDto;
  }

  static userDeviceToDto(
    jwtContext: JwtContext,
    userDevice: CompleteUserDevice,
  ): UserDeviceDto {
    const userAgent = userDevice.device.userAgent;

    let deviceDto = plainToInstance(DeviceDto, {
      ...userDevice.device,
      id: Number(userDevice.device.id),
      userAgent:
        userDevice.device.userAgent !== null
          ? userDevice.device.userAgent
          : undefined,
      userAgentData:
        userDevice.device.userAgentData !== null
          ? userDevice.device.userAgentData
          : undefined,
    });

    if (userAgent) {
      const uaParser = new UAParser(userAgent);
      const uaResult: UAParser.IResult = uaParser.getResult();
      deviceDto = {
        ...deviceDto,
        uaResult,
      };
    }

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
    const {
      enableNavigationEntryExpiration,
      navigationEntryExpirationInDays,
      enableImageEncoding,
      enableExplicitContentFilter,
      enableStopTracking,
    } = updateUserPreferencesInput;

    const updatedUserPreferences =
      await this.prismaService.userPreferences.update({
        where: {
          userId: jwtContext.user.id,
        },
        data: {
          enableNavigationEntryExpiration,
          navigationEntryExpirationInDays,
          enableImageEncoding,
          enableExplicitContentFilter,
          enableStopTracking,
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

  async delete(jwtContext: JwtContext): Promise<MessageResponse> {
    await this.prismaService.$transaction(async (prismaClient) => {
      await prismaClient.userPreferences.deleteMany({
        where: {
          userId: jwtContext.user.id,
        },
      });

      await prismaClient.navigationEntry.deleteMany({
        where: {
          userId: jwtContext.user.id,
        },
      });

      await prismaClient.session.deleteMany({
        where: {
          userDevice: { userId: jwtContext.user.id },
        },
      });

      await prismaClient.userDevice.deleteMany({
        where: {
          userId: jwtContext.user.id,
        },
      });

      await prismaClient.user.deleteMany({
        where: {
          id: jwtContext.user.id,
        },
      });

      const orphanDevices = await prismaClient.device.findMany({
        where: {
          userDevices: {
            none: {},
          },
        },
      });

      const deviceIdsToDelete = orphanDevices.map((device) => device.id);

      await prismaClient.device.deleteMany({
        where: {
          id: { in: deviceIdsToDelete },
        },
      });
    });

    return plainToClassFromExist(new MessageResponse(), {
      message: 'User deleted',
    });
  }

  async changePassword(
    jwtContext: JwtContext,
    changePasswordInput: ChangePasswordInput,
  ): Promise<MessageResponse> {
    const { oldPassword, newPassword } = changePasswordInput;
    await this.authService.validateUserOrThrow(
      jwtContext.user.email,
      oldPassword,
    );
    await this.authService.updatePassword(jwtContext, newPassword);

    return {
      statusCode: 200,
      message: 'Pasword updated successfully!',
    };
  }

  async changeDisplayName(
    jwtContext: JwtContext,
    changeDisplayNameInput: ChangeDisplayNameInput,
  ): Promise<MessageResponse> {
    const { displayname: displayName } = changeDisplayNameInput;
    await this.authService.updateDisplayName(jwtContext, displayName);

    return {
      statusCode: 200,
      message: 'Displayname updated successfully!',
    };
  }

  async changeProfilePicture(
    jwtContext: JwtContext,
    changeProfilePictureInput: ChangeProfilePictureInput,
  ): Promise<MessageResponse> {
    const userId = jwtContext.user.id;
    const { profilePicture } = changeProfilePictureInput;
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        profilePicture: profilePicture || '',
      },
    });

    return {
      statusCode: 200,
      message: 'Profile picture updated successfully!',
    };
  }
}
