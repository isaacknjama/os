import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';

describe('SwapController', () => {
  let swapController: SwapController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SwapController],
      providers: [SwapService],
    }).compile();

    swapController = app.get<SwapController>(SwapController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(swapController.getHello()).toBe('Hello World!');
    });
  });
});
