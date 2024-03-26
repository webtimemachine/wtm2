import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestMessageResponse,
  ApiConflictMessageResponse,
  ApiInternalServerErrorMessageResponse,
  ApiUnauthorizedMessageResponse,
} from '../../common/decorators';
import { JwtRefreshToken, JwtRequestContext } from '../decorators';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../dtos';
import { LocalAuthGuard } from '../guards';
import { JwtRefreshContext } from '../interfaces';
import { AuthService } from '../services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
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

  @ApiOkResponse({
    status: 200,
    type: RefreshResponseDto,
  })
  @JwtRefreshToken()
  @Get('refresh')
  async refreshToken(
    @JwtRequestContext() context: JwtRefreshContext,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(context);
  }
}
