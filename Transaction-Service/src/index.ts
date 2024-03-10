import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/handler.middleware';
import TransactionRoute from './routes/transaction.route'
import sequelize from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT_SERVER;


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexion a la base de datos realizada con éxito');
  } catch( err ) {
    console.error( "Database connection error:", err );
  }
})();

app.use( express.json() );
app.use( cors() );



app.use( "/api/transaction", TransactionRoute );
app.use( "*", errorHandler );


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});