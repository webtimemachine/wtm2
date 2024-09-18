import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../common/common.module';
import { EmailService } from '../common/services';
import { AuthController } from './controllers';
import { AuthService } from './services';
import {
  JWTAccessStrategy,
  JWTRefreshStrategy,
  JwtRecoveryTokenStrategy,
  JwtVerificationTokenStrategy,
  LocalStrategy,
} from './strategies';

@Module({
  imports: [CommonModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    EmailService,
    JwtService,
    LocalStrategy,
    JWTAccessStrategy,
    JWTRefreshStrategy,
    JwtRecoveryTokenStrategy,
    JwtVerificationTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
