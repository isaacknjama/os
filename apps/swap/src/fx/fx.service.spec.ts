import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { FxService } from './fx.service';

const mock_rate = 8708520.117232416;

describe('FxService Mocked', () => {
  let mockFxService: FxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule, CacheModule.register()],
      providers: [
        ConfigService,
        {
          provide: FxService,
          useValue: {
            getBtcToKesRate: jest.fn(() => {
              return mock_rate;
            }),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    mockFxService = module.get<FxService>(FxService);
  });

  it('should be defined', () => {
    expect(mockFxService).toBeDefined();
  });

  it('should return a rate', async () => {
    const rate = await mockFxService.getBtcToKesRate();

    expect(rate).toBeDefined();
  });
});

describe('FxService Real', () => {
  let fxService: FxService;
  let mockCfg: { get: jest.Mock };
  let mockCacheManager: any;

  beforeEach(async () => {
    mockCfg = {
      get: jest.fn(),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule, CacheModule.register()],
      providers: [
        {
          provide: ConfigService,
          useValue: mockCfg,
        },
        FxService,
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    fxService = module.get<FxService>(FxService);
  });

  it('should be defined', () => {
    expect(fxService).toBeDefined();
  });

  it('dev: should use MOCK_BTC_KES_RATE config', async () => {
    (mockCfg.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'NODE_ENV':
          return 'dev';
        case 'MOCK_BTC_KES_RATE':
          return mock_rate;
        default:
          return undefined;
      }
    });

    await expect(await fxService.getBtcToKesRate()).toEqual(mock_rate);
  });

  it('dev: throws error if MOCK_BTC_KES_RATE config are not set', async () => {
    (mockCfg.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'NODE_ENV':
          return 'dev';
        default:
          return undefined;
      }
    });

    await expect(fxService.getBtcToKesRate()).rejects.toThrow(
      'Either CURRENCY_API_KEY or MOCK_BTC_KES_RATE must be configured',
    );
  });

  it('production: can use MOCK_BTC_KES_RATE config if CURRENCY_API_KEY is not set', async () => {
    (mockCfg.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'NODE_ENV':
          return 'production';
        case 'MOCK_BTC_KES_RATE':
          return mock_rate;
        default:
          return undefined;
      }
    });

    await expect(await fxService.getBtcToKesRate()).toEqual(mock_rate);
  });

  it('production: throws error if CURRENCY_API_KEY and MOCK_BTC_KES_RATE config are not set', async () => {
    (mockCfg.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'NODE_ENV':
          return 'production';
        default:
          return undefined;
      }
    });

    await expect(fxService.getBtcToKesRate()).rejects.toThrow(
      'CURRENCY_API_KEY not found',
    );
  });

  it('production: should throw a 401 error when CURRENCY_API_KEY config is not valid', async () => {
    (mockCfg.get as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case 'NODE_ENV':
          return 'production';
        case 'CURRENCY_API_KEY':
          return 'test-api-key';
        case 'MOCK_BTC_KES_RATE':
          return mock_rate;
        default:
          return undefined;
      }
    });

    await expect(fxService.getBtcToKesRate()).rejects.toThrow(
      'Request failed with status code 401',
    );
  });
});
