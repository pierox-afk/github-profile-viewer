import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const corsOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((origin) => origin.trim()),
    methods: ['GET'],
  });

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);

  console.log(`Backend running on http://localhost:${port}/api`);
}

void bootstrap();
