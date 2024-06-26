import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { appEnv } from './config';
import { getVersion } from './getVersion';
import { options } from './swagger-options';

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SentryFilter } from './sentry.filter';

const initSentry = () => {
  Sentry.init({
    dsn: appEnv.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
};

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  if (appEnv.SENTRY_DSN) {
    initSentry();
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new SentryFilter(httpAdapter));
  }

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
    .setTitle('WebTM')
    .setDescription(
      'API developed by Intermedia to manage services for WebTM multi-platform tool',
    )
    .setVersion(version)
    .addBearerAuth(bearerAuthJWT, 'accessToken')
    .addBearerAuth(bearerAuthJWT, 'refreshToken')
    .addBearerAuth(bearerAuthJWT, 'recoveryToken')
    .addBearerAuth(bearerAuthJWT, 'partialToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, options);

  await app.listen(appEnv.PORT);
  logger.log(`Application ready on port ${appEnv.PORT}`);
  logger.log(`Docs ready on ${appEnv.BASE_URL}`);
}
bootstrap();
