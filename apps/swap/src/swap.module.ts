import * as  Joi from 'joi';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@bitsacco/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { FxService } from './fx/fx.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string().required(),
      SWAP_GRPC_URL: Joi.string().required(),
      MOCK_BTC_KES_RATE: Joi.number(),
      CURRENCY_API_KEY: Joi.string(),
      DATABASE_URL: Joi.string().required(),
    })
  }), LoggerModule, HttpModule, CacheModule.register()],
  controllers: [SwapController],
  providers: [SwapService, FxService],
})
export class SwapModule { }
