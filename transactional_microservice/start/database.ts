import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseconfig } from './config';
import { DatabaseInterface } from './interfaces/database.interface';

/**
 * Construcción del uri base
 */
const buildBaseUrl = ({
  srv,
  host,
  port,
  user,
  password,
  dbName,
}: DatabaseInterface): string => {
  let mongo_url = 'mongodb';
  // Construye URL Mongo
  if (srv == 'true') mongo_url += '+srv';
  mongo_url += '://';
  if (user && password) {
    if (user) mongo_url += user;
    mongo_url += ':';
    if (password) mongo_url += password;
    mongo_url += '@';
  }
  mongo_url += `${host}:${port}/${dbName}`;
  return mongo_url;
};

/**
 * Construcción de opciones del URI
 */
const buildOptionsForConnectionUrl = (configDatabase: any = {}): string => {
  const optionsForMongo: any = {};
  const authSource = configDatabase.dbAuthSource;
  if (authSource) optionsForMongo.authSource = authSource;

  let restOfUrl = '';
  if (Object.keys(optionsForMongo).length > 0) {
    restOfUrl = '?';
    for (const key in optionsForMongo) {
      if (optionsForMongo.hasOwnProperty(key)) {
        restOfUrl += `${key}=${optionsForMongo[key]}&`;
      }
    }
  }
  // Elimina el último "&"
  restOfUrl = restOfUrl.slice(0, -1);
  return restOfUrl;
};

const buildUri = (): string => {
  const mongoConfig: DatabaseInterface = databaseconfig;
  let uriMongo = buildBaseUrl(mongoConfig);
  uriMongo += buildOptionsForConnectionUrl(mongoConfig);
  console.log('uriMongo', uriMongo);

  return uriMongo;
};

@Global()
@Module({
  imports: [
    // Conexion a la DB
    MongooseModule.forRoot(buildUri()),
  ],
  exports: [MongooseModule],
})
export class Database {}
