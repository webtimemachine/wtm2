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
  ApiNotFoundMessageResponse,
  ApiUnauthorizedMessageResponse,
} from '../../common/decorators';
import { MessageResponse } from '../../common/dtos';
import {
  JwtAccessToken,
  JwtPartialToken,
  JwtRecoveryToken,
  JwtRefreshToken,
  JwtRequestContext,
} from '../decorators';
import {
  LoginRequestDto,
  LoginResponseDto,
  RecoverPasswordDto,
  RecoveryValidationResponseDto,
  RefreshResponseDto,
  RestorePasswordDto,
  SignUpRequestDto,
  SignUpResponseDto,
  ValidateRecoveryCodeDto,
  VerifyAccountDto,
} from '../dtos';
import { LocalAuthGuard } from '../guards';
import {
  JwtContext,
  JwtRefreshContext,
  PartialJwtContext,
} from '../interfaces';
import { AuthService } from '../services';
import { CompleteSessionDto } from '../dtos/complete-session.dto';
import { LogoutSessionInputDto } from '../dtos/logout-session.input.dto';

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
  ): Promise<LoginResponseDto | SignUpResponseDto> {
    const user = req.user;
    const { deviceKey, userAgent, userAgentData } = body;
    return await this.authService.login(
      deviceKey,
      userAgent,
      userAgentData,
      user,
    );
  }

  @ApiOkResponse({
    status: 200,
    type: MessageResponse,
  })
  @JwtAccessToken()
  @HttpCode(200)
  @Post('logout')
  async logout(
    @JwtRequestContext() context: JwtContext,
  ): Promise<MessageResponse> {
    return this.authService.logout(context);
  }

  @ApiOkResponse({
    status: 200,
    type: LoginResponseDto,
  })
  @ApiUnauthorizedMessageResponse()
  @ApiInternalServerErrorMessageResponse()
  @ApiBadRequestMessageResponse()
  @HttpCode(200)
  @JwtPartialToken()
  @Post('/verify')
  async verifyAccount(
    @JwtRequestContext() context: PartialJwtContext,
    @Body() verifyEmailDto: VerifyAccountDto,
  ): Promise<LoginResponseDto> {
    return this.authService.verifyAccount(context, verifyEmailDto);
  }

  @ApiOkResponse({
    type: MessageResponse,
    status: 200,
  })
  @ApiInternalServerErrorMessageResponse()
  @HttpCode(200)
  @JwtPartialToken()
  @Post('verify/resend')
  async resendVerificationEmail(
    @JwtRequestContext() context: PartialJwtContext,
  ): Promise<MessageResponse> {
    return this.authService.resendVerificationEmail(context);
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

  @ApiOkResponse({
    type: MessageResponse,
  })
  @ApiNotFoundMessageResponse()
  @ApiBadRequestMessageResponse()
  @HttpCode(200)
  @Post('password/recover')
  async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<MessageResponse> {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @ApiOkResponse({
    status: 200,
    type: RecoveryValidationResponseDto,
  })
  @ApiNotFoundMessageResponse()
  @HttpCode(200)
  @Post('password/validate-recovery-code')
  async validateRecoveryCode(
    @Body() validateRecoveryCodeDto: ValidateRecoveryCodeDto,
  ): Promise<RecoveryValidationResponseDto> {
    return this.authService.validateRecoveryCode(validateRecoveryCodeDto);
  }

  @ApiOkResponse({
    status: 200,
    type: LoginResponseDto || SignUpResponseDto,
  })
  @ApiNotFoundMessageResponse()
  @JwtRecoveryToken()
  @HttpCode(200)
  @Post('password/restore')
  async restorePassword(
    @JwtRequestContext() context: JwtContext,
    @Body() restorePasswordDto: RestorePasswordDto,
  ): Promise<LoginResponseDto | SignUpResponseDto> {
    return this.authService.restorePassword(context, restorePasswordDto);
  }

  @ApiOkResponse({
    status: 200,
    type: CompleteSessionDto,
    isArray: true,
  })
  @JwtAccessToken()
  @HttpCode(200)
  @Get('session')
  async getActiveSessions(
    @JwtRequestContext() context: JwtContext,
  ): Promise<CompleteSessionDto[]> {
    return this.authService.getActiveSessions(context);
  }

  @ApiOkResponse({
    status: 200,
    type: MessageResponse,
  })
  @JwtAccessToken()
  @HttpCode(200)
  @Post('session/logout')
  async logoutSession(
    @Body() logoutSessionInputDto: LogoutSessionInputDto,
  ): Promise<MessageResponse> {
    return this.authService.logoutSession(logoutSessionInputDto);
  }
}
