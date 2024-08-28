import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtContext } from '../../auth/interfaces';
import { JwtAccessToken, JwtRequestContext } from '../../auth/decorators';

import { ChangePasswordInput, UserDto } from '../dtos';
import { UserService } from '../services';
import { MessageResponse } from 'src/common/dtos';

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
  @Post('/change-password')
  changePassword(
    @JwtRequestContext() context: JwtContext,
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<any> {
    return this.userService.changePassword(context, changePasswordInput);
  }
}
