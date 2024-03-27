import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Patch,
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
  ApiOkMessageResponse,
  ApiUnauthorizedMessageResponse,
} from '../../common/decorators';
import { DataResponse, MessageResponse } from '../../common/dtos';
import {
  JwtRecoveryToken,
  JwtRefreshToken,
  JwtRequestContext,
} from '../decorators';
import {
  InitiatePasswordRecoveryDto,
  LoginRequestDto,
  LoginResponseDto,
  PasswordRecoveryCheckDto,
  RecoverNewPasswordDto,
  RecoveryResponseDto,
  RefreshResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
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

  @ApiOkMessageResponse()
  @ApiBadRequestMessageResponse()
  @ApiInternalServerErrorMessageResponse()
  @Patch('password-recovery/initiate')
  async initiatePasswordRecovery(
    @Body() initiatePasswordRecoveryDto: InitiatePasswordRecoveryDto,
  ): Promise<MessageResponse> {
    return this.authService.initiatePasswordRecovery(
      initiatePasswordRecoveryDto,
    );
  }

  @ApiOkResponse({
    status: 200,
    type: RecoveryResponseDto,
  })
  @ApiNotFoundMessageResponse()
  @Patch('password-recovery/validate')
  async validatePasswordRecovery(
    @Body() passwordRecoveryDto: PasswordRecoveryCheckDto,
  ): Promise<DataResponse<RecoveryResponseDto>> {
    return this.authService.validatePasswordRecovery(passwordRecoveryDto);
  }

  @ApiOkResponse({
    status: 200,
    type: LoginResponseDto,
  })
  @ApiNotFoundMessageResponse()
  @JwtRecoveryToken()
  @Patch('password-recovery/complete')
  async completePasswordRecovery(
    @JwtRequestContext() context: JwtContext,
    @Body() recoverNewPasswordDto: RecoverNewPasswordDto,
  ): Promise<DataResponse<LoginResponseDto>> {
    return this.authService.completePasswordRecovery(
      context,
      recoverNewPasswordDto,
    );
  }
}
