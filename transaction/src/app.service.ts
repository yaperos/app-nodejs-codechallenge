import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityManager } from 'typeorm';
import { TransactionEntity } from './infrastructure/entities/transaction.entity';

let manager: EntityManager;

@Injectable()
export class AppService {
  private dataSource: DataSource | void;

  constructor(private readonly configService: ConfigService) {}

  // Función para obtener la configuración de la base de datos PostgreSQL desde ConfigService
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

  // Método que se ejecuta al inicializar el módulo
  async onModuleInit() {
    console.log('dbConfigPostgres', this.dbConfigPostgres());

    // Definir las entidades de la base de datos
    const entities = [TransactionEntity];

    // Obtener la configuración de la base de datos
    const config = this.dbConfigPostgres();

    // Inicializar la fuente de datos y atrapar errores si ocurren
    this.dataSource = await new DataSource({
      type: 'postgres',
      ...config,
      entities,
    })
      .initialize()
      .catch((error) => {
        console.log(error);
        process.exit(1); // Salir del proceso si ocurre un error
      });

    // Asignar el EntityManager para poder utilizarlo en otros lugares del servicio
    manager = (this.dataSource as DataSource).manager;
  }

  // Método estático para obtener el EntityManager desde fuera del servicio
  static get manager() {
    return manager;
  }
}
