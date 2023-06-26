'use strict'
const KafkaConfig = require('./configurations/kafkaConfig');

var app = require('./app');
var port = 3700;

async function autorizar() {

  let transactionStatusEvent = null;
  let message = null

  // Consumir un mensaje desde el topic transacción
  try {
    const kafkaConfig = new KafkaConfig()
    kafkaConfig.consume('transaction', (data) => {
      console.log('consumer message -> ' + data)
      const jsonMessage = JSON.parse(data);
      if (jsonMessage.value > 1000) {
        transactionStatusEvent = 'rejected';
        message = '';
      } else {
        transactionStatusEvent = 'approved';
        message = 'Actualizar el estado de la transacción!';
      }

      const transaction = {
        transactionExternalId: jsonMessage.transactionExternalId,
        accountExternalIdDebit: jsonMessage.accountExternalIdDebit,
        accountExternalIdCredit: jsonMessage.accountExternalIdCredit,
        tranferTypeId: jsonMessage.tranferTypeId,
        value: jsonMessage.value,
        transactionType: jsonMessage.transactionType,
        transactionStatus: jsonMessage.transactionStatus,
        createdAt: jsonMessage.createdAt,
        transactionStatusEvent,
        message
      };

      // Publicar un mensaje en el topic de Kafka para que sea consumido por el servicio de transacción
      kafkaConfig.produce("antifraud", [{ value: JSON.stringify(transaction)}]);

    })
  } catch (err) {
    console.log(err)
  }

}

//Servicio activo
app.listen(port, () => {
  console.log(`Servicio Antifraude Ejecutado-> http://localhost:${port}`);
  return autorizar();
});