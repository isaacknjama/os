import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  LoggerModule,
  SWAP_PACKAGE_NAME,
  SWAP_SERVICE_NAME,
} from '@bitsacco/common';
import { SwapController, SwapService } from './swap';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: SWAP_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: SWAP_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/swap.proto'),
            url: configService.getOrThrow('SWAP_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SwapController],
  providers: [SwapService],
})
export class ApiModule {}
