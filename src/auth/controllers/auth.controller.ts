import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services';
import { ApiTags, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import {
  ApiBadRequestMessageResponse,
  ApiConflictMessageResponse,
  ApiInternalServerErrorMessageResponse,
  ApiUnauthorizedMessageResponse,
} from '../../common/decorators';
import {
  LoginRequestDto,
  LoginResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../dtos';
import { LocalAuthGuard } from '../guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiConflictMessageResponse()
  @ApiOkResponse({
    status: 200,
    type: SignUpResponseDto,
  })
  @HttpCode(200)
  @Post('signup')
  signup(
    @Body() signUpDtoRequest: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    return this.authService.signup(signUpDtoRequest);
  }

  @ApiUnauthorizedMessageResponse()
  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    status: 200,
    type: LoginResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @Req() req: any,
    @Body() body: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const user = req.user;
    return await this.authService.login(body, user);
  }
}
