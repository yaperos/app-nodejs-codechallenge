import mongoose from 'mongoose';
import logger from './logger';

const database = {
  connect: async () => {
    let conn = null;
    const uri = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;

    if (conn == null) {
      conn = mongoose
        .connect(uri, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
          logger.info('Database connected successfully');
          return mongoose;
        })
        .catch((err: Error) => {
          if (err.message.includes('connect ECONNREFUSED')) {
            logger.error("Can't reach Mongo Database");
          } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
            logger.error(`Can't reach '${process.env.DB_HOST}' address`);
          } else {
            logger.error(err.message);
          }
          throw err;
        });

      await conn;
    }

    return conn;
  },
};

export default database;
