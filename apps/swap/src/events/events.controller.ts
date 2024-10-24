import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { process_swap_update } from '@bitsacco/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @EventPattern(process_swap_update)
  async handleSwapUpdate(data: any) {
    await this.eventsService.processSwapUpdate(data);
  }
}
