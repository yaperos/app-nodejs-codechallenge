import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule,ConfigService  } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import entities from './typeorm/entities';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [    
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        migrations: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    
    ClientsModule.register([
      {
        name:'challenger-client',
        transport:Transport.KAFKA,
        options:{
          
          client:{
            brokers:['localhost:9092']
          }
        }

      }
    ]),
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
