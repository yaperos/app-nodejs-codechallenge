import { LoggerService } from '@nestjs/common/services/logger.service';
import { CommonPayload } from '../mutations/common-payload.interface';

export interface HandleErrorParams<T> {
    payload: CommonPayload<T>;
    logger: LoggerService;
    err: unknown;
}
