import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

import { AppModule } from './app.module';

const { version, description, author } = JSON.parse(
  fs.readFileSync('package.json', 'utf8'),
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('CulturaEduca API')
    .addServer(configService.get<string>('swaggerServer'))
    .setDescription(description)
    .setVersion(version)
    .setContact(author.name, author.url, author.email)
    .build();
  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: 'CulturaEduca API',
  });

  await app.listen(configService.get<number>('port'));
}
bootstrap();
