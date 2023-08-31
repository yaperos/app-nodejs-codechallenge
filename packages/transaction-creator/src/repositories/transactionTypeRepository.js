class TransactionTypeRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async createTransactionType(id, name) {
    const query = "INSERT INTO transactionTypes (id,name) VALUES ($1, $2) RETURNING *";
    const values = [id, name];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getTransactionTypes() {
    const query = "SELECT * FROM transactionTypes";
    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = TransactionTypeRepository;
