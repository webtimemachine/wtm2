import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AppModule } from './app.module';
import { appEnv } from './config';
import { options } from './swagger-options';
import * as bodyParser from 'body-parser';
import { getVersion } from './getVersion';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const bearerAuthJWT: SecuritySchemeObject = {
    description: `Please enter your JWT token`,
    name: 'Authorization',
    bearerFormat: 'Bearer',
    scheme: 'Bearer',
    type: 'http',
    in: 'Header',
  };

  const version = await getVersion();

  const config = new DocumentBuilder()
    .setTitle('Web Time Machine')
    .setDescription(
      'API developed by Intermedia to manage services for Web Time Machine multi-platform tool',
    )
    .setVersion(version)
    .addBearerAuth(bearerAuthJWT, 'accessToken')
    .addBearerAuth(bearerAuthJWT, 'refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, options);

  await app.listen(appEnv.PORT);
  logger.log(`Application ready on port ${appEnv.PORT}`);
  logger.log(`Docs ready on ${appEnv.BASE_URL}`);
}
bootstrap();
