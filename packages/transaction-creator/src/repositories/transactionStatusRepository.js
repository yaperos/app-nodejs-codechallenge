class TransactionStatusRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async createTransactionStatus(id, name) {
    const query = "INSERT INTO transactionStatus (id,name) VALUES ($1, $2) RETURNING *";
    const values = [id, name];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getTransactionStatus() {
    const query = "SELECT * FROM transactionStatus";
    const result = await this.pool.query(query);
    return result.rows;
  }
}
module.exports = TransactionStatusRepository;
