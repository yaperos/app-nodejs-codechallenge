import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/handler.middleware';
import TransactionRoute from './routes/transaction.route'
import pool from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT_SERVER;


(async () => {
  const client = await pool.connect();
  try {
    console.log('Conexion a la base de datos realizada con éxito');
  } finally {
    client.release();
  }
})();

app.use( express.json() );
app.use( cors() );



app.use( "/api/transaction", TransactionRoute );
app.use( "*", errorHandler );


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});