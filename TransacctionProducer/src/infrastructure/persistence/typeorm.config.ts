import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.server,
  port:  parseInt(process.env.port),
  username: process.env.username, 
  password: process.env.password, 
  database: process.env.database, 
  synchronize: false,
};

export default typeOrmConfig;
