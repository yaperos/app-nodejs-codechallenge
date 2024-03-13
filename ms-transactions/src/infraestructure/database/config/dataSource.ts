import { DatabaseConfig } from './index';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource(DatabaseConfig as DataSourceOptions);
