import express from 'express';
import cors from "cors";

import { errorHandler } from './middlewares/handler.middleware';
import TransactionRoute from './routes/transaction.route'
const app = express();
const PORT = 3000;


app.use( express.json() );
app.use( cors() );



app.use( "/api/transaction", TransactionRoute );
app.use( "*", errorHandler );


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});