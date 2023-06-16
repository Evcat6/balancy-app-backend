import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

config();
import { AppModule } from './app.module';
import { logger } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const environment = configService.get<string>('node_env');

  if (environment === 'development') {
    const docConfig = new DocumentBuilder()
      .setTitle('Balancyй API')
      .setDescription('Balancyй API - list of available endpoints')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('api-docs', app, document);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = configService.get<number>('port');
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
