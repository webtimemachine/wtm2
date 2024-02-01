import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { NavigationModule } from './navigation/navigation.module';

@Module({
  imports: [CommonModule, AuthModule, NavigationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
