import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import configs from '../configs';
import { DatabaseService } from './database/services/database.service';
import { MicroservicesClientModule } from './microservices-client/microservices-client.module';
import { MicroservicesClientService } from './microservices-client/services/microservices-client.service';
import { ClientProxyFactory } from '@nestjs/microservices';
// import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [],
  providers: [
    {
      provide: 'TRANSACTIONS_PRODUCER',
      useFactory: (microservicesClientService: MicroservicesClientService) => {
        const microservicesClientOptions =
          microservicesClientService.getOptions();
        return ClientProxyFactory.create(microservicesClientOptions);
      },
      inject: [MicroservicesClientService],
    },
  ],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: (databaseOptionsService: DatabaseService) =>
        databaseOptionsService.generateConnection(),
    }),
    MicroservicesClientModule,
    DatabaseModule,
  ],
  exports: ['TRANSACTIONS_PRODUCER'],
})
export class CommonModule {}
