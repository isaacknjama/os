import { Module } from '@nestjs/common';
import { LoggerModule } from '@bitsacco/common';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';

@Module({
  imports: [
    LoggerModule
  ],
  controllers: [SwapController],
  providers: [SwapService],
})
export class SwapModule {}
