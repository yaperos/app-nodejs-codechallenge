import { Inject, Injectable } from '@nestjs/common';
import { IProducerService } from './transactions/domain/producer.interface';

@Injectable()
export class AppService {
  constructor( @Inject('IProducerService') private readonly producerService: IProducerService){}

  async getHello(){
    await this.producerService.produce('test', {
      value: 'Hello World!',
    });

    return 'Hello World!';
  }
}
