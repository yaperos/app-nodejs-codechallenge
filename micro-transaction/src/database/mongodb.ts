import * as mongoose from 'mongoose';
import * as mongooseSequence from 'mongoose-sequence';
import { CONFIG } from '../utils/environments';

export const AutoIncrement = mongooseSequence(mongoose);

const databaseEvents = (dbConnectionName: string) => {
  mongoose.connection.on('error', (error) => {
    console.log('error', `<${dbConnectionName}> connection error: ${error}`);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('error', `<${dbConnectionName}> connection lost`);
  });
  mongoose.connection.on('connecting', () => {
    console.log('info', `Connecting to <${dbConnectionName}>`);
  });
  mongoose.connection.on('open', () => {
    console.log('info', `<${dbConnectionName}> connected`);
  });
};

export default async (dbConnectionName: string) => {
  try {
    databaseEvents(dbConnectionName);

    await mongoose.connect(CONFIG.DATABASE.MONGO.HOST, {
      user: CONFIG.DATABASE.MONGO.USER,
      pass: CONFIG.DATABASE.MONGO.PASSWORD,
      dbName: CONFIG.DATABASE.MONGO.NAME
    });

  } catch (err) {
    console.log('error', `Could not Connect to <${dbConnectionName}>: ${err}.`);
    process.exit(1);
  }
};
