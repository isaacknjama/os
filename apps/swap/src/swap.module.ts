import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@bitsacco/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { FxService } from './fx/fx.service';

@Module({
  imports: [ConfigModule, LoggerModule, HttpModule, CacheModule.register()],
  controllers: [SwapController],
  providers: [SwapService, FxService],
})
export class SwapModule {}
