const express = require('express');
const { antiFraud } = require('./kafka/transaction/consumer');
const transactionRouter = require('./routes/transaction');

const app = express();

app.use(express.json({ limit: '20mb' }))
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '20mb' }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
});

const port = process.env.PORT || 3000

app.use('/transaction', transactionRouter);
app.listen(port, async() => {
  try{
    await antiFraud();
  }catch(e){
    console.log(`error kafka consumer >>> ${e}`);
  }

  console.log(`Server running at http://localhost:${port}/`);
});