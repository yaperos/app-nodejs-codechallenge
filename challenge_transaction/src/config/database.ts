'use strict';

import * as path from "path";
import {DataSource, DataSourceOptions} from "typeorm";
import "reflect-metadata";
import { Env } from './EnvConfiguration';

interface IConfigRedis {
    'redis_host': string,
    'redis_port': string,
    'redis_expire': number
}

class ConfigDataBase{
    protected mongo_db_secret: string = (process.env.MONGO_SECRET_DB || 'mbL+sTX5C1');
    protected mysql_db_secret: string = (process.env.MYSQL_SECRET_DB || 'mbL+sTX5C1');
    protected mongo_db: DataSourceOptions;
    protected redis_db: IConfigRedis;
    protected mysql_db: DataSourceOptions;
    protected pgsql_db: DataSourceOptions;
    protected envLoaded:any = new Env();
    constructor() {
        this.envLoaded.getEnv;
        switch (process.env.NODE_ENV) {
            case 'production':
                this.mongo_db = {
                    type: "mongodb",
                    host: (process.env.MONGO_HOST || "localhost"),
                    name: (process.env.MONGO_NAME || "MongoDB"),
                    port: (typeof process.env.MONGO_PORT === 'string'?parseInt(process.env.MONGO_PORT):27017),
                    username: (process.env.MONGO_USERNAME || "root"),
                    password: (process.env.MONGO_PASSWORD || "admin"),
                    database: (process.env.MONGO_DATABASE || "test"),
                    entities: [path.normalize( __dirname + "/../models/**/*{.js,.ts}"), path.normalize( __dirname + "/../models/*{.js,.ts}")],
                    synchronize: (typeof process.env.MONGO_SYNCHRONIZE === 'string'?process.env.MONGO_SYNCHRONIZE !== 'false':false),
                    logging: (typeof process.env.MONGO_LOGGING === 'string'?process.env.MONGO_LOGGING !== 'false':false)
                };
                break;
            default:
                this.mongo_db = {
                    type: "mongodb",
                    host: (process.env.MONGO_HOST || "localhost"),
                    name: (process.env.MONGO_NAME || "MongoDB"),
                    port: (typeof process.env.MONGO_PORT === 'string'?parseInt(process.env.MONGO_PORT):27017),
                    database: (process.env.MONGO_DATABASE || "test"),
                    entities: [path.normalize( __dirname + "/../models/**/*{.js,.ts}"), path.normalize( __dirname + "/../models/*{.js,.ts}")],
                    synchronize: (typeof process.env.MONGO_SYNCHRONIZE === 'string'?process.env.MONGO_SYNCHRONIZE !== 'false':false),
                    logging: (typeof process.env.MONGO_LOGGING === 'string'?process.env.MONGO_LOGGING !== 'false':false)
                };
        }
        this.mysql_db = {
            type: "mysql",
            host: (process.env.MYSQL_HOST || "localhost"),
            name: (process.env.MYSQL_NAME || "MySql"),
            port: (typeof process.env.MYSQL_PORT === 'string'?parseInt(process.env.MYSQL_PORT):3306),
            username: (process.env.MYSQL_USERNAME || "root"),
            password: (process.env.MYSQL_PASSWORD || "admin"),
            database: (process.env.MYSQL_DATABASE || "test"),
            entities: [path.normalize( __dirname + "/../models/**/*{.js,.ts}"), path.normalize( __dirname + "/../models/*{.js,.ts}")],
            migrations: [path.normalize(__dirname + "/../migrations/*{.js,.ts}")],
            synchronize: (typeof process.env.MYSQL_SYNCHRONIZE === 'string'?process.env.MYSQL_SYNCHRONIZE !== 'false':false),
            logging: (typeof process.env.MYSQL_LOGGING === 'string'?process.env.MYSQL_LOGGING !== 'false':false)
        };
        this.pgsql_db = {
            type: "postgres",
            host: (process.env.PGSQL_HOST || "localhost"),
            name: (process.env.PGSQL_NAME || "PgSql"),
            port: (typeof process.env.PGSQL_PORT === 'string'?parseInt(process.env.PGSQL_PORT):5432),
            username: (process.env.PGSQL_USERNAME || "postgres"),
            password: (process.env.PGSQL_PASSWORD || "admin"),
            database: (process.env.PGSQL_DATABASE || "postgres"),
            entities: [path.normalize( __dirname + "/../models/**/*{.js,.ts}"), path.normalize( __dirname + "/../models/*{.js,.ts}")],
            migrations: [path.normalize(__dirname + "/../migrations/*{.js,.ts}")],
            synchronize: (typeof process.env.PGSQL_SYNCHRONIZE === 'string'?process.env.PGSQL_SYNCHRONIZE !== 'false':false),
            logging: (typeof process.env.PGSQL_LOGGING === 'string'?process.env.PGSQL_LOGGING !== 'false':false)
        };
        this.redis_db = {
            'redis_host': (process.env.REDIS_HOST || '127.0.0.1'),
            'redis_port': (process.env.REDIS_PORT || '16379'),
            'redis_expire': (process.env.REDIS_EXPIRE?parseInt(process.env.REDIS_EXPIRE):(60 * 60 * 1000))
        };
    }

    getMongoConfig(){
        return this.mongo_db;
    }

    getMongoSecret(){
        return this.mongo_db_secret;
    }

    getMysqlSecret(){
        return this.mysql_db_secret;
    }

    getRedisConfig(){
        return this.redis_db;
    }

    getMysqlConfig(){
        return this.mysql_db;
    }

    getPgsqlConfig(){
        return this.pgsql_db;
    }

    getArrayOfSpecifDB(numbesrOfDatabase:number=3){
        switch (numbesrOfDatabase) {
            case 1:
                console.info("Connecting to MongoDB");
                return [this.mongo_db];
            case 2:
                console.info("Connecting to  MySql");
                return [this.mysql_db];
            case 3:
                console.info("Connecting to  PostgreSQL");
                return [this.pgsql_db];
            default:
                console.info("Connecting to MongoDB and MySql");
                return [this.mongo_db, this.mysql_db];
        }
    }
}

export {
    ConfigDataBase,
    IConfigRedis
};
