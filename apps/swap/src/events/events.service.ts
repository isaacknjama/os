import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  async processSwapUpdate(data: any) {
    this.logger.log('Processing Swap Update');
    this.logger.log(data);
  }
}
