const {
  SERVICE_ENV,
} = require('./consts')

const { initConsumer, initProducer } = require('./libs/kafka')
const processMessageBroker = require('./broker/processMessageBroker')

initProducer()
initConsumer(processMessageBroker)

console.debug('--------------------------------------------------')
console.debug(`Service "${SERVICE_ENV.NAME}" started 🚀`)
console.debug(`Node version ${process.version}`)
console.debug('--------------------------------------------------')
