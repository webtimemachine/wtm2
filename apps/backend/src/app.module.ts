import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { NavigationModule } from './navigation/navigation.module';
import { HealthModule } from './health/health.module';
import { ExplicitFilterModule } from './filter/filter.module';
import { SystemModule } from './system/system.module';
@Module({
  imports: [
    CommonModule,
    UserModule,
    NavigationModule,
    HealthModule,
    ExplicitFilterModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
