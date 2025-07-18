import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsModule } from './transactions/transaction.module';
import { ApplicationPropertiesService } from './config/application-properties.service';
import configuration from './config/configuration';
import { Transaction } from './transactions/transaction.entity';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    // Configuración global mejorada
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible globalmente
      load: [configuration], // Carga la configuración desde variables de entorno
      envFilePath: ['.env.local', '.env'], // Archivos de entorno
      cache: true, // Cache de configuración para mejor performance
      expandVariables: true, // Permite variables anidadas como ${NODE_ENV}
    }),
    
    // TypeORM con configuración dinámica
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [Transaction],
        synchronize: configService.get<string>('environment') !== 'production',
        logging: configService.get<string>('environment') === 'development',
        ssl: configService.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : false,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    }),
    
    TransactionsModule,
    KafkaModule,
  ],
  providers: [
    ApplicationPropertiesService, // Servicio de propiedades global
  ],
  exports: [
    ApplicationPropertiesService, // Exportar para uso en otros módulos
  ],
})
export class AppModule {}
