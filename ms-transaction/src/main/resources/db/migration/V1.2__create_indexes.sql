CREATE INDEX IF NOT EXISTS idx_transaction_status_code ON transaction_status (code);

CREATE INDEX IF NOT EXISTS idx_transfer_type_id ON transfer_type (transfer_type_id);

CREATE INDEX IF NOT EXISTS idx_transaction_external_id ON transaction (transaction_external_id);