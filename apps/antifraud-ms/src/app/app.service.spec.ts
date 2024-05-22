import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AntifraudRequest } from '@app-nodejs-codechallenge/core-lib';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Logger } from '@nestjs/common';

jest.mock('fs');
jest.mock('js-yaml');

describe('AppService', () => {
  let service: AppService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
    logger = new Logger(AppService.name);
    service['logger'] = logger;

    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTransaction', () => {
    it('should return fraud detected when a rule is triggered', () => {
      const tx: AntifraudRequest = {
        key: 'key1',
        amount: 1500,
        from: 'acc1',
        to: 'acc2',
      };
      const rules = {
        'fraud-rules': [
          {
            name: 'Value greater than 1000 should be rejected.',
            condition: '>',
            value: 1000,
            enabled: true,
            description: 'Value greater than 1000 should be rejected.',
          },
        ],
      };

      jest.spyOn(service, 'loadYaml').mockReturnValue(rules);
      jest
        .spyOn(service, 'evaluateRule')
        .mockReturnValueOnce({ isFraud: true });

      const result = service.validateTransaction(tx);

      expect(result).toEqual({
        isFraud: true,
        amount: 1500,
        message: 'Value greater than 1000 should be rejected.',
      });
    });

    it('should return no fraud detected when no rules are triggered', () => {
      const tx: AntifraudRequest = {
        key: 'key1',
        amount: 50,
        from: 'acc1',
        to: 'acc2',
      };
      const rules = {
        'fraud-rules': [
          {
            name: 'Value greater than 1000 should be rejected.',
            condition: '>',
            value: 1000,
            enabled: true,
            description: 'Value greater than 1000 should be rejected.',
          },
        ],
      };

      jest.spyOn(service, 'loadYaml').mockReturnValue(rules);
      jest.spyOn(service, 'evaluateRule').mockReturnValue({ isFraud: false });

      const result = service.validateTransaction(tx);
      expect(result).toEqual({
        isFraud: false,
        amount: 50,
        message: 'No fraud detected',
      });
    });
  });

  describe('evaluateRule', () => {
    it('should return isFraud true when condition is met', () => {
      const result = service.evaluateRule('>', 150, 100);
      expect(result).toEqual({ isFraud: true });
    });

    it('should return isFraud false when condition is not met', () => {
      const result = service.evaluateRule('>', 100, 1000);
      expect(result).toEqual({ isFraud: false });
    });
  });

  describe('loadYaml', () => {
    it('should load YAML configuration correctly', () => {
      const yamlContent = {
        'fraud-rules': [
          {
            name: 'Value is greater than 0',
            condition: '>',
            value: 0,
            enabled: false,
            description: 'Value is greater than 0',
          },
          {
            name: 'Value is less than 1000',
            condition: '<',
            value: 10001,
            enabled: true,
            description: 'Value is less than 1000',
          },
        ],
      };
      (readFileSync as jest.Mock).mockReturnValue('yaml-content');
      (yaml.load as jest.Mock).mockReturnValue(yamlContent);

      const result = service.loadYaml();
      expect(result).toEqual(yamlContent);
      expect(readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('fraud-rules.config.yaml'),
        'utf8'
      );
      expect(yaml.load).toHaveBeenCalledWith('yaml-content');
    });

    it('should handle errors when loading YAML configuration', () => {
      const error = new Error('Test error');
      (readFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const result = service.loadYaml();
      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        `Error loading the YAML config file: ${error}`
      );
    });
  });
});
