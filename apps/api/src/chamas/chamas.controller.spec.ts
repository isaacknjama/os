import { TestingModule } from '@nestjs/testing';
import { CHAMAS_SERVICE_NAME, ChamasServiceClient } from '@bitsacco/common';
import { createTestingModuleWithValidation } from '@bitsacco/testing';
import { type ClientGrpc } from '@nestjs/microservices';
import { ChamasController } from './chamas.controller';

describe('ChamasController', () => {
  let serviceGenerator: ClientGrpc;
  let chamaController: ChamasController;
  let chamasServiceClient: Partial<ChamasServiceClient>;

  beforeEach(async () => {
    serviceGenerator = {
      getService: jest.fn().mockReturnValue(chamasServiceClient),
      getClientByServiceName: jest.fn().mockReturnValue(chamasServiceClient),
    };

    const module: TestingModule = await createTestingModuleWithValidation({
      controllers: [ChamasController],
      providers: [
        {
          provide: CHAMAS_SERVICE_NAME,
          useValue: serviceGenerator,
        },
      ],
    });

    chamaController = module.get<ChamasController>(ChamasController);
  });

  it('should be defined', () => {
    expect(chamaController).toBeDefined();
  });
});
