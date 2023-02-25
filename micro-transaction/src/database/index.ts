import initMongoDB from './mongodb';
import { CONFIG } from '../utils/environments';

const database = CONFIG.DATABASE.MONGO.NAME;

export const initDatabases = () => {
  console.log('info', 'connecting databases...');
  console.log('info', `init connection to <${database}>`);
  initMongoDB(database);

  console.log('info', 'databases connected');
};
