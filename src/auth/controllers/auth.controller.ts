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
} from '../dtos';
import { LocalAuthGuard } from '../guards';
import { JwtContext, JwtRefreshContext } from '../interfaces';
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
    const { deviceKey, userAgent } = body;
    return await this.authService.login(deviceKey, userAgent, user);
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
    type: LoginResponseDto,
  })
  @ApiNotFoundMessageResponse()
  @JwtRecoveryToken()
  @HttpCode(200)
  @Post('password/restore')
  async restorePassword(
    @JwtRequestContext() context: JwtContext,
    @Body() restorePasswordDto: RestorePasswordDto,
  ): Promise<LoginResponseDto> {
    return this.authService.restorePassword(context, restorePasswordDto);
  }
}
