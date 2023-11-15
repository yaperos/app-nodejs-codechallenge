import { Client as DBClient } from "pg";
import { PENDING_CODE, dbConfig } from "./config";
import { kafkaConsumer, offset } from "./kafka";
import transactionParser, { DBTransaction, Transaction } from "./types/transactionParser";
import { getStatusCodeByValue } from "./antifraud";
import { getCurrentDateTime } from "./utils";

(async () => {
  const dbClient = new DBClient(dbConfig);

  const dbConnection = () => {
    return new Promise((resolve, reject) => {
      dbClient.connect(function (err) {
        if (err) reject(err);
        resolve("success");
      });
    });
  };

  await dbConnection();

  const checkIfRecordExists = async (transactionId: string): Promise<DBTransaction> => {
    const searchRecord = await dbClient.query({
      text: `SELECT * FROM transactions WHERE transaction_id='${transactionId}' LIMIT 1`,
    });

    return searchRecord.rowCount === 1 ? searchRecord.rows[0] : null;
  };

  const createRecord = async (validatedPayload: Transaction): Promise<boolean> => {
    const { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, transactionId, value } = validatedPayload;
    const insert = await dbClient.query({
      text: "INSERT into transactions(account_external_id_debit, account_external_id_credit, transfer_type_id, transfer_status_id, transaction_id, value ) VALUES($1, $2,$3,$4, $5,$6)",
      values: [accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, PENDING_CODE, transactionId, value],
    });

    return Boolean(insert.rowCount);
  };

  const updateRecord = async ({ transactionId, value }: Pick<Transaction, "transactionId" | "value">): Promise<boolean> => {
    const updateRecord = await dbClient.query({
      text: `UPDATE transactions SET transfer_status_id='${getStatusCodeByValue(
        value
      )}', updated_at='${getCurrentDateTime()}' WHERE transaction_id='${transactionId}'`,
    });

    return Boolean(updateRecord.rowCount);
  };

  kafkaConsumer.on("message", async (message) => {
    const payloadBuffer = JSON.parse(message.value.toString());

    try {
      const validatedPayload = transactionParser.parse(payloadBuffer[0]);
      const { transactionId, value } = validatedPayload;
      console.log("transaction_id to check", transactionId);

      const transactionRecord = await checkIfRecordExists(transactionId);
      // "cb55634e-32d0-489f-83aa-53a040286c0b"

      if (!transactionRecord) {
        const createResponse = await createRecord(validatedPayload);
        createResponse && console.log("record created!");

        const updateResponse = await updateRecord({ transactionId, value });
        updateResponse && console.log("record updated!");
        return;
      }

      transactionRecord &&
        console.log("transaction record found:", transactionRecord.transaction_id, transactionRecord.value, transactionRecord.transfer_status_id);

      if (parseInt(transactionRecord.transfer_status_id) === 1) {
        const updateResponse = await updateRecord({ transactionId, value });
        updateResponse && console.log("..updated existing record!");
      } else {
        console.log("record already validated");
      }
    } catch (error) {
      console.error(error);
    }
  });

  kafkaConsumer.on("offsetOutOfRange", async (ofst) => {
    const { topic, partition } = ofst;

    offset.fetch([ofst], function (err, offsets) {
      if (err) {
        return console.error(err);
      }
      var min = Math.min(offsets[topic][partition]);
      kafkaConsumer.setOffset(topic, partition, min);
    });
  });

  kafkaConsumer.on("error", (msg) => {
    console.error("error kafa", msg);
  });
})();
