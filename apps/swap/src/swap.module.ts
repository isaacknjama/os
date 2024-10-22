import { Module } from '@nestjs/common';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';

@Module({
  imports: [],
  controllers: [SwapController],
  providers: [SwapService],
})
export class SwapModule { }
