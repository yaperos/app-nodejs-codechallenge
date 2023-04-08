import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { createUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientKafka) {}
  async onModuleInit() {
    this.client.subscribeToResponseOf('user.create');
    await this.client.connect();
  }
  async createUser(data: createUserDto) {
    console.log('createUser', data);
    const payload = data;
    return this.client.send('user.create', payload);
  }
}
