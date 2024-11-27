import { BuySharesDto, Empty } from '@bitsacco/common';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { SharesService } from './shares.service';

@Controller('shares')
export class SharesController {
  private readonly logger = new Logger(SharesController.name);

  constructor(private readonly sharesService: SharesService) {
    this.logger.log('SharesController initialized');
  }

  @Post('buy')
  @ApiOperation({ summary: 'Buy Bitsacco shares' })
  @ApiBody({
    type: BuySharesDto,
  })
  buyShares(@Body() req: BuySharesDto) {
    return this.sharesService.buyShares(req);
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Show Bitsacco share subscription levels' })
  getShareSubscription() {
    return this.sharesService.getShareSubscription({});
  }
}
