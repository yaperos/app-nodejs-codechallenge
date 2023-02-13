import { Injectable, Inject } from '@nestjs/common';
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
    void this.transactionClient
      .emit(EVENT_UPDATE_TRANSACTION_STATUS_REQUEST, {
          value: {
            features,
            transactionId,
          },
      })
      .subscribe({
        error: (err) => {
          console.error(
            err,
            `getAntifraudFeatures -> [${EVENT_UPDATE_TRANSACTION_STATUS_REQUEST}] = ${err.message}`,
          );
        },        
    });
  }
}
