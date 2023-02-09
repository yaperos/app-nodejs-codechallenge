import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('validateValue', () => {
    it('should return false if value is greater than 1000', () => {
      expect(appService.validateValue(1001)).toBe(false);
    });

    it('should return true if value is less than 1000', () => {
      expect(appService.validateValue(999)).toBe(true);
    });
  });
});
