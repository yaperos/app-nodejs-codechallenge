import {Injectable} from "@nestjs/common";
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from "passport-jwt";
import {config} from 'dotenv';

config()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }
}
