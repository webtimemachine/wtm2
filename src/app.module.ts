import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NavigationModule } from './navigation/navigation.module';
import { HealthModule } from './health/health.module';
import { SemanticSearchModule } from './semanticSearch/semanticSearch.module';
import { QueryModule } from './query/query.module';
import { ExplicitFilterModule } from './filter/filter.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    NavigationModule,
    HealthModule,
    SemanticSearchModule,
    QueryModule,
    ExplicitFilterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
