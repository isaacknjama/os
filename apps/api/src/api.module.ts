import { Module } from '@nestjs/common';
import { SwapController } from './swap/swap.controller';
import { SwapService } from './swap/swap.service';

@Module({
  imports: [],
  controllers: [SwapController],
  providers: [SwapService],
})
export class ApiModule {}
