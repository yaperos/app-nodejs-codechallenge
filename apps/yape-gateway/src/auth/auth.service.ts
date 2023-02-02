import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject('YAPE_AUTH_MICROSERVICE')
    private readonly authClient: ClientKafka,
  ) {}

  login(login: any) {
    console.log('before emit login');
    this.authClient.emit('yape.auth.login', JSON.stringify(login));
  }
}
