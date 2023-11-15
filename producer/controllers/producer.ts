import { FastifyReply, FastifyRequest } from "fastify";
import { kafkaClient, kafkaProducer } from "../kafka";
import transactionParser, { DBTransaction, DBTransactionRecord, Transaction } from "../types/transactionParser";
import { TOPIC_NAME } from "../config/constants";
import { ProduceRequest } from "kafka-node";
import { dbClient } from "../database";

type TransactionParams = {
  transactionId: string;
};

kafkaClient.on("error", () => {
  console.error(`Kafka client error`);
  // ToDo: Implement handling mechanism to avoid errors
});

kafkaProducer.on("error", () => {
  console.error("kafka producer error");
  // ToDo: Implement handling mechanism to avoid errors
});

const checkIfRecordExists = async (transactionId: string): Promise<DBTransaction> => {
  const searchRecord = await dbClient.query({
    text: `SELECT * FROM transactions WHERE transaction_id='${transactionId}' LIMIT 1`,
  });

  return searchRecord.rowCount === 1 ? searchRecord.rows[0] : null;
};

const getRecord = async (transactionId: string): Promise<DBTransactionRecord> => {
  const searchRecord = await dbClient.query({
    text: `SELECT 
    t.transaction_id as transactionExternalId, tsc."name" as transactionStatus,
    tt."name" as transactionType, t.value, t.created_at, t.updated_at
    FROM transactions t
    INNER join transaction_status_codes tsc on t.transfer_status_id  = tsc.id 
    inner join transaction_types tt on t.transfer_type_id =tt.id 
    WHERE transaction_id='${transactionId}' LIMIT 1;`,
  });

  return searchRecord.rowCount === 1 ? searchRecord.rows[0] : null;
};

const postTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
  let transaction: Transaction;

  if (!request.body) {
    reply.code(400).header("Content-Type", "application/json; charset=utf-8").send({ error: "missing payload" });
    return;
  }

  try {
    transaction = transactionParser.parse(request.body);
  } catch (error) {
    reply.code(400).header("Content-Type", "application/json; charset=utf-8").send({ error });
    return;
  }

  const { transactionId } = transaction;

  const existingRecord = await checkIfRecordExists(transactionId);

  if (existingRecord) {
    reply.code(400).send({
      transactionId: transactionId,
      message: "transaction already exists",
    });

    return;
  }

  const messageBuffer = Buffer.from(JSON.stringify([{ ...transaction }]));

  const payload = <Array<ProduceRequest>>[
    {
      topic: TOPIC_NAME!,
      messages: messageBuffer,
      attributes: 1,
      key: transactionId,
    },
  ];

  const sendToKafka = () =>
    new Promise((resolve, reject) => {
      kafkaProducer.send(payload, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });

  try {
    const resultado = await sendToKafka();

    reply.code(201).send({
      transactionId: transaction.transactionId,
      message: resultado,
    });
  } catch (error) {
    reply.code(500).send({
      transactionId: transaction.transactionId,
      message: "could not be processed",
    });
  }
};

const getTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
  const { transactionId } = request.params as TransactionParams;

  const record = await getRecord(transactionId);

  if (!record) {
    return reply.code(204).send({
      transactionId: transactionId,
    });
  }

  const { transactionexternalid, transactiontype, transactionstatus, value, created_at } = record;

  return reply.code(200).send({
    transactionExternalId: transactionexternalid,
    transactionType: {
      name: transactiontype,
    },
    transactionStatus: {
      name: transactionstatus,
    },
    value: value,
    createdAt: created_at,
  });
};

export { postTransaction, getTransaction };
