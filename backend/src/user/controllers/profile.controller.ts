import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtContext } from '../../auth/interfaces';
import { JwtAccessToken, JwtRequestContext } from '../../auth/decorators';
import { MessageResponse } from '../../common/dtos';

import { ChangePasswordInput, UserDto, ChangeDisplayNameInput } from '../dtos';
import { UserService } from '../services';

@ApiTags('User')
@Controller('user/profile')
export class ProfileController {
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
    type: MessageResponse,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Post('/change-password')
  changePassword(
    @JwtRequestContext() context: JwtContext,
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<any> {
    return this.userService.changePassword(context, changePasswordInput);
  }

  @ApiOkResponse({
    status: 200,
    type: MessageResponse,
  })
  @JwtAccessToken([])
  @HttpCode(200)
  @Post('/change-displayname')
  changeDisplayName(
    @JwtRequestContext() context: JwtContext,
    @Body() changePasswordInput: ChangeDisplayNameInput,
  ): Promise<any> {
    return this.userService.changeDisplayName(context, changePasswordInput);
  }
}
