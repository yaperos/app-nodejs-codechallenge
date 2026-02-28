-- Schema for Transaction Service
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    account_external_id_debit VARCHAR(255) NOT NULL,
    account_external_id_credit VARCHAR(255) NOT NULL,
    transfer_type_id VARCHAR(255) NOT NULL,
    value DECIMAL(19, 4) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transaction_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_created_at ON transactions(created_at);

-- Comments
COMMENT ON TABLE transactions IS 'Tabla de transacciones del sistema';
COMMENT ON COLUMN transactions.transaction_id IS 'ID único de la transacción (UUID)';
COMMENT ON COLUMN transactions.status IS 'Estado de la transacción: PENDING, PROCESSING, COMPLETED, FAILED';
