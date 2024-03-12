import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CompleteUser } from '../types';

import { PrismaService } from '../../common/services';
import { JwtContext } from '../../auth/interfaces';

import { plainToInstance } from 'class-transformer';
import {
  UpdateUserPreferencesInput,
  UserDto,
  UserPreferencesDto,
} from '../dtos';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  completeUserToDto(completeUser: CompleteUser): UserDto {
    const userPreferencesDto = plainToInstance(
      UserPreferencesDto,
      completeUser.userPreferences,
    );
    const userDto = plainToInstance(UserDto, completeUser);
    userDto.userPreferences = userPreferencesDto;
    return userDto;
  }

  async getMe(jwtContext: JwtContext): Promise<UserDto> {
    return this.completeUserToDto(jwtContext.user);
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
}

export const completeUserInclude = Prisma.validator<Prisma.UserInclude>()({
  userPreferences: true,
});
