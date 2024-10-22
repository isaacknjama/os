import { Injectable } from '@nestjs/common';

@Injectable()
export class SwapService {
  getHello(): string {
    return 'Hello World!';
  }
}
