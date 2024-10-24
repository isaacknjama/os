import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SendSTKPushResponse } from './intasend.types';
import { SendSTKPushDto } from '../dto';

// import IntaSend from 'intasend-node';
import IntaSend = require('intasend-node');

@Injectable()
export class IntasendService implements OnModuleInit {
  private readonly logger = new Logger(IntasendService.name);
  private intasend: IntaSend;

  constructor(private readonly configService: ConfigService) {
    this.logger.log('IntasendService created');
  }

  onModuleInit() {
    this.logger.log('IntasendService initialized');

    const pubkey = this.configService.getOrThrow<string>('INTASEND_PUBLIC_KEY');
    const privkey = this.configService.getOrThrow<string>(
      'INTASEND_PRIVATE_KEY',
    );

    const test_mode = pubkey.includes('test') || privkey.includes('test');

    if (test_mode) {
      this.logger.log('IntasendService running in test mode');
    } else {
      this.logger.log('IntasendService running in production mode');
    }

    this.intasend = new IntaSend(pubkey, privkey, test_mode);
  }

  async sendStkPush(payload: SendSTKPushDto): Promise<SendSTKPushResponse> {
    this.logger.log(`Sending STK push to ${payload.phone_number}`);
    return this.intasend.collection().mpesaStkPush(payload);
  }
}
