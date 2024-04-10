import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
