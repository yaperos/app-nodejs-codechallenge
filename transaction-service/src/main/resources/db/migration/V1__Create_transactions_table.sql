CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_external_id UUID NOT NULL UNIQUE,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INTEGER NOT NULL,
    value NUMERIC(19, 4) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_transactions_external_id ON transactions(transaction_external_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

COMMENT ON TABLE transactions IS 'Financial transactions table for Yape challenge';
COMMENT ON COLUMN transactions.transaction_external_id IS 'Public UUID for external reference';
COMMENT ON COLUMN transactions.status IS 'Transaction status: pending, approved, rejected';
COMMENT ON COLUMN transactions.version IS 'Optimistic locking version';
