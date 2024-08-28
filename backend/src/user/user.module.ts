import { Module } from '@nestjs/common';
import { UserController, ProfileController } from './controllers';
import { UserService } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class UserModule {}
