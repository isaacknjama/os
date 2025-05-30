import * as Joi from 'joi';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import {
  DatabaseModule,
  EVENTS_SERVICE_BUS,
  FedimintService,
  LoggerModule,
  LnurlMetricsService,
  SMS_SERVICE_NAME,
  SWAP_SERVICE_NAME,
  UsersDocument,
  UsersRepository,
  UsersSchema,
  UsersService,
  RedisProvider,
  getRedisConfig,
  configRedisCacheStore,
  RoleValidationService,
} from '@bitsacco/common';
import {
  ChamaWalletDocument,
  ChamaWalletRepository,
  ChamaWalletSchema,
} from './wallet/db';
import { ChamasDocument, ChamasRepository, ChamasSchema } from './chamas/db';
import { ChamaMessageService } from './chamas/chamas.messaging';
import { ChamasService } from './chamas/chamas.service';
import { ChamaMetricsService } from './chamas/chama.metrics';
import { ChamaWalletService } from './wallet/wallet.service';
import { ChamaController } from './chama.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CHAMA_GRPC_URL: Joi.string().required(),
        SWAP_GRPC_URL: Joi.string().required(),
        SMS_GRPC_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        CHAMA_EXPERIENCE_URL: Joi.string().required(),
        FEDIMINT_CLIENTD_BASE_URL: Joi.string().required(),
        FEDIMINT_CLIENTD_PASSWORD: Joi.string().required(),
        FEDIMINT_FEDERATION_ID: Joi.string().required(),
        FEDIMINT_GATEWAY_ID: Joi.string().required(),
        LNURL_CALLBACK: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        BITLY_TOKEN: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_TLS: Joi.boolean().default(false),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.getOrThrow('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: SWAP_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'swap',
            protoPath: join(__dirname, '../../../proto/swap.proto'),
            url: configService.getOrThrow<string>('SWAP_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: SMS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'sms',
            protoPath: join(__dirname, '../../../proto/sms.proto'),
            url: configService.getOrThrow<string>('SMS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: EVENTS_SERVICE_BUS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: getRedisConfig(configService),
        }),
        inject: [ConfigService],
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const ttl = 60 * 60 * 5; // 5 hours
        return configRedisCacheStore(configService, ttl);
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
      delimiter: '.',
      verboseMemoryLeak: true,
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ChamasDocument.name, schema: ChamasSchema },
      { name: ChamaWalletDocument.name, schema: ChamaWalletSchema },
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
    HttpModule,
    LoggerModule,
  ],
  controllers: [ChamaController],
  providers: [
    ConfigService,
    ChamasService,
    ChamasRepository,
    ChamaMessageService,
    ChamaWalletService,
    ChamaWalletRepository,
    UsersService,
    UsersRepository,
    FedimintService,
    LnurlMetricsService,
    ChamaMetricsService,
    RedisProvider,
    RoleValidationService,
  ],
})
export class ChamaModule {}
