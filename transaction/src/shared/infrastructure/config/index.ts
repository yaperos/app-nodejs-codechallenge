import AppConfig from './app.config';
import SwaggerConfig from './swagger.config';
import PostgresConfig from '../persistence/postgres.config';
import MongoConfig from '../persistence/mongo.config';

export default [AppConfig, PostgresConfig, MongoConfig, SwaggerConfig];
