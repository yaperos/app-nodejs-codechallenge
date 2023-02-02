import {Module} from '@nestjs/common';
import {YapeTransactionController} from './yape-transaction.controller';
import {YapeTransactionService} from './yape-transaction.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {config} from 'dotenv';
import {UserEntity} from "@yape/yape-domain/entity/user.entity";
import {TxEntity} from "@yape/yape-domain/entity/tx.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";

config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '127.0.0.1',
            port: parseInt(process.env.TYPEORM_PORT),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            entities: [UserEntity, TxEntity],
            synchronize: false,
            logging: true,
        }),
        TypeOrmModule.forFeature([UserEntity, TxEntity]),
        ClientsModule.register([
            {
                name: 'YAPE_AF_MICROSERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'yape-af',
                        brokers: ['localhost:9092'],
                    },
                    producerOnlyMode: true,
                    consumer: {
                        groupId: 'yape-af-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [YapeTransactionController],
    providers: [YapeTransactionService],
})
export class YapeTransactionModule {
}
