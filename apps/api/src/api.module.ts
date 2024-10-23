import { join } from 'path';
import * as  Joi from 'joi';
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
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        SWAP_GRPC_URL: Joi.string().required(),
      }),
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
