import { Controller, Get } from '@nestjs/common';
import { SwapService } from './swap.service';

@Controller()
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get()
  getHello(): string {
    return this.swapService.getHello();
  }
}
