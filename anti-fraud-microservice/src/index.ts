import * as transactionConsumer from './consumers/transaction.consumer'


transactionConsumer.start().catch((err) => {
    console.log('Application Consumer Error')
    console.error(err)
    process.exit(1)
})
