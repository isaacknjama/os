import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { process_swap_update } from '@bitsacco/common';
import { EventsService } from './events.service';
import { MpesaTransactionUpdateDto } from '../dto';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @EventPattern(process_swap_update)
  async handleSwapUpdate(data: MpesaTransactionUpdateDto) {
    await this.eventsService.processSwapUpdate(data);
  }
}
