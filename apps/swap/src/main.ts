import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { SwapModule } from './swap.module';

async function bootstrap() {
  const app = await NestFactory.create(SwapModule);

  const configService = app.get(ConfigService);

  const swap_url = configService.getOrThrow<string>('SWAP_GRPC_URL');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'swap',
      url: swap_url,
      protoPath: join(__dirname, '../../../proto/swap.proto'),
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  });

  const redis_host = configService.getOrThrow<string>('REDIS_HOST');
  const redis_port = configService.getOrThrow<number>('REDIS_PORT');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: redis_host,
      port: redis_port,
      retryAttempts: 2,
      retryDelay: 100,
    },
  });

  // setup pino logging
  app.useLogger(app.get(Logger));

  // setup validation
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}

bootstrap();
