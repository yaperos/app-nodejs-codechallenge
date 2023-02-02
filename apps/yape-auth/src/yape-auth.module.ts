import {Module} from '@nestjs/common';
import {YapeAuthController} from './yape-auth.controller';
import {YapeAuthService} from './yape-auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "@yape/yape-domain/entity/user.entity";
import {JwtStrategy} from "./jwt.strategy";
import {config} from 'dotenv';
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
import {PassportModule} from "@nestjs/passport";

config();

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3600s' },
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '127.0.0.1',
            port: parseInt(process.env.TYPEORM_PORT),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            entities: [UserEntity],
            synchronize: false,
            logging: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [YapeAuthController],
    providers: [YapeAuthService, JwtStrategy],
})
export class YapeAuthModule {
}
