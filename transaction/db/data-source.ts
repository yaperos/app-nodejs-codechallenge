import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: 'localhost',
	username: 'postgres',
	database: 'challenge',
	password: 'postgres',
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
