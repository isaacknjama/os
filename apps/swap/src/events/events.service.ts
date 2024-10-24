import { Injectable, Logger } from '@nestjs/common';
import { MpesaTransactionUpdateDto } from '../dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  async processSwapUpdate(data: MpesaTransactionUpdateDto) {
    this.logger.log('Processing Swap Update');
    this.logger.log(data);
  }
}
