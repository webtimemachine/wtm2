import { Module } from '@nestjs/common';
import { UserController, ProfileController } from './controllers';
import { UserService } from './services';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class UserModule {}
