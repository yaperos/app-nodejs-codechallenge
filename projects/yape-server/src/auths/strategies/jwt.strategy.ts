import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

config();
const _configService = new ConfigService();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync('src/auths/certs/jwt-public.key', 'utf8'),
      algorithms: [_configService.get('ALGORITHM')],
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      userName: payload.username,
      email: payload.email,
    };
  }
}
