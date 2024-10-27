import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FedimintClient } from './fmts';

@Injectable()
export class FedimintService implements OnModuleInit {
  private readonly logger = new Logger(FedimintService.name);
  private fedimint: FedimintClient;

  constructor(private readonly configService: ConfigService) {
    this.logger.log('FedimintService initialized');
  }

  onModuleInit() {
    const baseUrl = this.configService.getOrThrow<string>(
      'FEDIMINT_CLIENTD_BASE_URL',
    );
    const password = this.configService.getOrThrow<string>(
      'FEDIMINT_CLIENTD_PASSWORD',
    );
    const federationId = this.configService.getOrThrow<string>(
      'FEDIMINT_FEDERATION_ID',
    );
    const gatewayId = this.configService.getOrThrow<string>(
      'FEDIMINT_GATEWAY_ID',
    );

    this.fedimint = new FedimintClient(
      baseUrl,
      password,
      federationId,
      gatewayId,
    );

    this.logger.log('FedimintService initialized');
  }
}
