import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) implements OnModuleInit {
  private readonly logger = new Logger('JwtStrategy');

  constructor(
    @Inject('TRANSACTION_KAFKA_SERVICE')
    private readonly userClient: ClientKafka,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'EmJRWjKQez',
    });
  }

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('validate_user');
    await this.userClient.connect();
  }

  async validate(payload: any) {
    const user = await firstValueFrom(
      this.userClient.send('validate_user', { userId: payload.userId }),
    );

    this.logger.debug(JSON.stringify(user));
    return { userId: payload.userId, email: user.email };
  }
}
