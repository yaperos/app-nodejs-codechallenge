const producerKafkaTwo = require("../kafka/producer");

class TransactionRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async createTransaction(transferTypeId, value, accountExternalIdDebit, accountExternalIdCredit) {
    const query =
      "INSERT INTO transactions (transaction_type,transaction_external_id,transaction_status,value,created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *";
    const createdAt = new Date();
    let transactionExternalId;
    if (accountExternalIdDebit) {
      transactionExternalId = accountExternalIdDebit;
    } else {
      transactionExternalId = accountExternalIdCredit;
    }
    const transactionType = transferTypeId;
    const values = [transactionType, transactionExternalId, 1, value, createdAt];
    const result = await this.pool.query(query, values);
    producerKafkaTwo.sendMessage({ id: result.rows[0].id, value: result.rows[0].value });
    return {
      ...result.rows[0],
      createdAt: new Date(result.rows[0].created_at).toLocaleDateString(),
      transactionExternalId: result.rows[0].transaction_external_id,
    };
  }

  async getTransactions() {
    const query = "SELECT * FROM transactions";
    const result = await this.pool.query(query);
    return result.rows.map((item) => {
      return {
        ...item,
        transactionExternalId: item.transaction_external_id,
        createdAt: new Date(item.created_at).toLocaleDateString(),
      };
    });
  }
}

module.exports = TransactionRepository;
