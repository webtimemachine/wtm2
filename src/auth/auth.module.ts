import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services';
import { CommonModule } from 'src/common/common.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [CommonModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, JwtService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
