'use strict'

const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Transaction = require('../models/transaction');
const KafkaConfig = require('../configurations/kafkaConfig');

class TransactionService {
  static async createTransaction(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value) {

    const transactionStatus = 'pending';

    const transaction = {
      transactionExternalId: uuidv4(),
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      transactionType: 'normal',
      transactionStatus,
      createdAt: new Date()
    };


    // Publicar un mensaje en el topic de Kafka para que sea validado por el servicio de antifraude
    try {
      const kafkaConfig = new KafkaConfig()
      kafkaConfig.produce("transaction", [{ value: JSON.stringify(transaction) }]);
    } catch (err) {
      console.log(err)
    }

    // Consume desde el topic antifraude
    const kafkaConfig = new KafkaConfig()
    kafkaConfig.consume('antifraud', (data) => {
      console.log('Consumer message -> ' + data);
      const jsonMessage = JSON.parse(data);
      // Guardar la transacción en la base de datos
      if (jsonMessage.transactionStatusEvent === 'approved') {
        const newTransaction = new Transaction(jsonMessage);
        newTransaction.save();
        console.log('Datos guardados con éxito!' + ' - ' + jsonMessage.message);
      } else {
        console.log('El valor supera el límite permitido de la transacción!');
      }
    })

    return transaction;

  }

  static async getTransaction(transactionExternalId, transactionType, transactionStatus, value, createdAt) {
    // filtar datos
    const filter = {};

    if (transactionExternalId) {
      filter.transactionExternalId = transactionExternalId;
    }
    if (transactionType) {
      filter.transactionType = transactionType;
    }
    if (transactionStatus) {
      filter.transactionStatus = transactionStatus;
    }
    if (value) {
      filter.value = value;
    }
    if (createdAt) {
      filter.createdAt = createdAt;
    }

    //Buscar la transacción en la base de datos
    const transaction = await Transaction.find(filter);

    if (transaction) {
      return transaction;
    } else {
      throw new Error('Transacción no encontrada');
    }
  }

  static async updateTransaction(transactionExternalId, transactionStatus) {

    //Obteniendo id y estadoTransaccion para filtrar
    const id = { transactionExternalId: transactionExternalId };
    const transactionStatusUpdate = { $set: { transactionStatus: transactionStatus } };

    // Actualizar el estado de la transacción en la base de datos
    const result = await Transaction.updateOne(id, transactionStatusUpdate);

    return 'Estado Transacción actualizada con éxito!';

  }
}

module.exports = TransactionService;
