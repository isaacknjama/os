import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { SwapModule } from './swap.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SwapModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'swap',
        url: process.env.SWAP_GRPC_URL ?? '0.0.0.0:4040',
        protoPath: join(__dirname, '../../../proto/swap.proto'),
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );

  // setup pino logging
  app.useLogger(app.get(Logger));

  await app.listen();
}

bootstrap();
