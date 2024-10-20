import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';

const API_VERSION = 'v1';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.setGlobalPrefix(API_VERSION);
  setupOpenAPI(app, 'docs');

  await app.listen(process.env.port ?? 3000);
}

bootstrap();

function setupOpenAPI(app: INestApplication, path: string, jsonPath?: string) {
  const options = new DocumentBuilder()
    .setTitle('Bitsacco API')
    .setDescription('endpoints for bitsacco api')
    .setVersion('1.0')
    .addTag('bitsacco')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(path, app, documentFactory, {
    useGlobalPrefix: true,
    jsonDocumentUrl: `${path}/json`,
    yamlDocumentUrl: `${path}/yaml`,
  });
}
