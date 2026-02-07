-- =========================================
-- Init DB for transaction services
-- =========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS transactions (
    transactionExternalId UUID PRIMARY KEY,
    accountExternalIdDebit UUID NOT NULL,
    accountExternalIdCredit UUID NOT NULL,
    transferTypeId INTEGER NOT NULL,
    value NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP NOT NULL
);
 
CREATE INDEX IF NOT EXISTS idx_transactions_status
    ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at
    ON transactions(createdAt);