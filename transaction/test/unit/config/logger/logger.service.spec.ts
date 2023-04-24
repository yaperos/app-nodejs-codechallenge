import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {LoggerService} from "@/config/logger/logger.service";

describe('loggerService', () => {
    let provider: LoggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [LoggerService],
        }).compile();

        provider = module.get<LoggerService>(LoggerService);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
