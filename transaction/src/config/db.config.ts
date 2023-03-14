import { TypeOrmModuleOptions } from '@nestjs/typeorm';

class DBConfig {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string): string {
    const value = process.env[key];
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k));
    return this;
  }

  public getPort() {
    return this.getValue('PORT');
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST') || 'localhost',
      port: parseInt(this.getValue('POSTGRES_PORT')) || 5432,
      username: this.getValue('POSTGRES_USER') || 'postgres',
      password: this.getValue('POSTGRES_PASSWORD') || 'postgres',
      database: this.getValue('POSTGRES_DATABASE') || 'postgres',
      autoLoadEntities: true,
      entities: [__dirname + '../entity/*.entity.{js,ts}'],
      synchronize: true, //en true solo porque no es un proyecto real
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      ssl: false,
    };
  }
}

const dbConfig = new DBConfig(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { dbConfig };
