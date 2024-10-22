import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SWAP_PACKAGE_NAME, SWAP_SERVICE_NAME } from '@bitsacco/common/types';
import { SwapController } from './swap/swap.controller';
import { SwapService } from './swap/swap.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SWAP_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: SWAP_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/swap.proto'),
            url: configService.getOrThrow('SWAP_GRPC_URL')
          }
        }),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [SwapController],
  providers: [SwapService],
})

export class ApiModule { }
