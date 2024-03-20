//LoggerService test
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../src/infrastructure/services/logger/logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log a message', async () => {
    const message = 'test message';
    const log = service.log('', message);
    expect(log).toBeUndefined();
  });

  it('should log a warning', async () => {
    const message = 'test message';
    const log = service.warn('', message);
    expect(log).toBeUndefined();
  });

  it('should log an error', async () => {
    const message = 'test message';
    const log = service.error('', message);
    expect(log).toBeUndefined();
  });

  it('should log a debug', async () => {
    const message = 'test message';
    const log = service.debug('', message);
    expect(log).toBeUndefined();
  });

  it('should log a verbose', async () => {
    const message = 'test message';
    const log = service.verbose('', message);
    expect(log).toBeUndefined();
  });
});
