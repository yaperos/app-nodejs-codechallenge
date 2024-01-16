import { DataSourceOptions, DataSource } from 'typeorm';
import options from './orm';

const Config: DataSourceOptions = options;

export const AppDataSource: DataSource = new DataSource(Config);
