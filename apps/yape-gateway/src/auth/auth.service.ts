import { Inject, Injectable } from '@nestjs/common';
import {ClientKafka, ClientProxy} from '@nestjs/microservices';
import {LoginDto} from "@yape/yape-domain/dto/auth.dto";
import {firstValueFrom} from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    @Inject('YAPE_AUTH_MICROSERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async login(login: LoginDto) {
    console.log('before emit login');

    return await firstValueFrom(this.authClient.send({cmd: 'auth.login'}, login));
  }
}
