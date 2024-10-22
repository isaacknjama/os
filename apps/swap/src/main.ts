import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { SwapModule } from './swap.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SwapModule, {
    transport: Transport.GRPC,
    options: {
      package: 'swap',
      url: process.env.SWAP_GRPC_URL ?? '0.0.0.0:4040',
      protoPath: join(__dirname, '../../../proto/swap.proto'),
      onLoadPackageDefinition: (pkg: any, server: any) => {
        new ReflectionService(pkg).addToServer(server);
      }
    },
  });
  await app.listen();
}

bootstrap();
