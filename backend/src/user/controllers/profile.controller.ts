import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtContext } from '../../auth/interfaces';
import { JwtAccessToken, JwtRequestContext } from '../../auth/decorators';

import { UserDto } from '../dtos';
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
}
