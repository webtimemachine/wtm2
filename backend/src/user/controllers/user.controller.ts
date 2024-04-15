import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtContext } from '../../auth/interfaces';
import { JwtAccessToken, JwtRequestContext } from '../../auth/decorators';

import { MessageResponse } from '../../common/dtos';
import { ApiInternalServerErrorMessageResponse } from '../../common/decorators';

import {
  UpdateUserDeviceInput,
  UpdateUserPreferencesInput,
  UserDto,
  UserPreferencesDto,
  UserDeviceDto,
} from '../dtos';
import { UserService } from '../services';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    status: 200,
    type: UserDto,
  })
  @JwtAccessToken([])
  @Get('/me')
  getMe(@JwtRequestContext() context: JwtContext): Promise<UserDto> {
    return this.userService.getMe(context);
  }

  @ApiOkResponse({
    status: 200,
    type: UserPreferencesDto,
  })
  @JwtAccessToken([])
  @Get('/preferences')
  getPreferences(
    @JwtRequestContext() context: JwtContext,
  ): Promise<UserPreferencesDto> {
    return this.userService.getPreferences(context);
  }

  @ApiOkResponse({
    status: 200,
    type: UserPreferencesDto,
  })
  @JwtAccessToken([])
  @Put('/preferences')
  async updatePreferences(
    @JwtRequestContext() context: JwtContext,
    @Body() updateUserPreferencesInput: UpdateUserPreferencesInput,
  ): Promise<UserPreferencesDto> {
    return this.userService.updatePreferences(
      context,
      updateUserPreferencesInput,
    );
  }

  @ApiOkResponse({
    status: 200,
    type: UserDeviceDto,
    isArray: true,
  })
  @JwtAccessToken([])
  @Get('/devices')
  getUserDevices(
    @JwtRequestContext() context: JwtContext,
  ): Promise<UserDeviceDto[]> {
    return this.userService.getUserDevices(context);
  }

  @ApiOkResponse({
    status: 200,
    type: UserDeviceDto,
  })
  @JwtAccessToken([])
  @Get('/current-device')
  getCurrentUserDevice(
    @JwtRequestContext() context: JwtContext,
  ): Promise<UserDeviceDto> {
    return this.userService.getCurrentUserDevice(context);
  }

  @ApiOkResponse({
    status: 200,
    type: UserDeviceDto,
  })
  @JwtAccessToken([])
  @Put('/device/:id')
  async updateUserDevice(
    @Param('id', ParseIntPipe) userDeviceId: number,
    @Body() updateUserDeviceInput: UpdateUserDeviceInput,
    @JwtRequestContext() context: JwtContext,
  ): Promise<UserDeviceDto> {
    return this.userService.updateUserDevice(
      context,
      userDeviceId,
      updateUserDeviceInput,
    );
  }

  @ApiInternalServerErrorMessageResponse()
  @ApiOkResponse({
    type: MessageResponse,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Delete('')
  delete(@JwtRequestContext() context: JwtContext): Promise<MessageResponse> {
    return this.userService.delete(context);
  }
}
