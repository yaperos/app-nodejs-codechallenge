import * as server from './server'
import * as transactionConsumer from './consumers/transaction.consumer'


server.start().catch((err) => {
    console.log('Application Server Error')
    console.error(err)
    process.exit(1)
})

transactionConsumer.start().catch((err) => {
    console.log('Application Consumer Error')
    console.error(err)
    process.exit(1)
})
