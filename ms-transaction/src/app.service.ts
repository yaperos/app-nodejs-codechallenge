import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityManager } from 'typeorm';
import { TransactionEntity } from './infrastructure/entities/transaction.entity';

let manager: EntityManager;
@Injectable()
export class AppService {
  private dataSource: DataSource | void;
  constructor(private readonly configService: ConfigService) {}
  private dbConfigPostgres() {
    return {
      autoLoadEntities: true,
      synchronize: true,
      host: this.configService.get('POSTGRES_HOST'),
      port: +this.configService.get<number>('POSTGRES_PORT'),
      username: this.configService.get('POSTGRES_USERNAME'),
      password: this.configService.get('POSTGRES_PASSWORD'),
      database: this.configService.get('POSTGRES_DATABASE'),
    };
  }
  async onModuleInit() {
    console.log('dbConfigPostgres', this.dbConfigPostgres());
    const entities = [TransactionEntity];
    const config = this.dbConfigPostgres();

    this.dataSource = await new DataSource({
      type: 'postgres',
      ...config,
      entities,
    })
      .initialize()
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });

    manager = (this.dataSource as DataSource).manager;
  }
  static get manager() {
    return manager;
  }
}
