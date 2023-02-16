import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { json } from 'stream/consumers';

@Injectable()
export class CreateProducer {
  constructor(private readonly _kafka: ProducerService) {}

  async create(id: string) {
    console.log('create call');
    console.log('create!!!');
    console.log(id);

    this._kafka.produce({
      topic: 'create-employee', 
      
      messages: [{ value: id }],
    });
  }
}