export enum TransactionQueries {
  INSERT = `INSERT INTO transactions ("accountExternalIdDebit", "accountExternalIdCredit", "tranferTypeId", "createdAt", "value", "transactionExternalId") VALUES ($1, $2, $3, $4, $5, $6)`,
  SELECT = `SELECT * FROM transactions where "transactionExternalId" = $1`,
  UPDATE = `UPDATE transactions SET "tranferTypeId" = $1 where "transactionExternalId" = $2`,
}
