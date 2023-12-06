import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	url: process.env.DATABASE_URL,
	username: 'postgres',
	database: 'challenge',
	password: 'postgres',
	synchronize: true,
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
