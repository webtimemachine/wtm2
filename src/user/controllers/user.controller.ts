import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services';
import { JwtAccessToken, JwtRequestContext } from 'src/auth/decorators';
import { JwtContext } from 'src/auth/interfaces';
import {
  UpdateUserPreferencesInput,
  UserDto,
  UserPreferencesDto,
} from '../dtos';

@ApiTags('User')
@Controller('user')
export class UserController {
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
}
