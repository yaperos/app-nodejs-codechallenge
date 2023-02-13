import { 
  Injectable, 
  Inject, 
  Logger,
} from '@nestjs/common';
import { 
  Repository,
} from 'typeorm';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import {
  EVENT_UPDATE_TRANSACTION_STATUS_REQUEST,
  TRANSACTION_SERVICE,
} from '../../../@shared';
import {
  AntifraudFeature,
} from './db';

@Injectable()
export class AntifraudEngineServiceService {
  private readonly logger = new Logger(AntifraudEngineServiceService.name);

  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly transactionClient: ClientKafka,
    @InjectRepository(AntifraudFeature)
    private readonly antifraudFeatureRepository: Repository<AntifraudFeature>,
  ) {}

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf(EVENT_UPDATE_TRANSACTION_STATUS_REQUEST);
  }
  
  async getAntifraudFeatures(transactionId: number): Promise<void> {
    const features = await this.antifraudFeatureRepository
    .find({
      where: {
        active: true,
      }
    });
    void this._emit(EVENT_UPDATE_TRANSACTION_STATUS_REQUEST, {
      features,
      transactionId,
    })
  }

  private async _emit<T>(topic: string, value: T): Promise<void> {
    this.transactionClient
      .emit(topic, {
          value,
      })
      .subscribe({
        error: (err) => {
          this.logger.error(
            `_emit -> [${topic}] = ${err.message}`,
            err,
          );
        },        
    });
  }
}
