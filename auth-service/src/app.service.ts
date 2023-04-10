import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientKafka) {
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('user.create');
    await this.client.connect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(data: any) {
    return data;
  }
}
