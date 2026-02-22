CREATE TABLE IF NOT EXISTS transactions (
    id                          UUID PRIMARY KEY,
    account_external_id_debit   UUID            NOT NULL,
    account_external_id_credit  UUID            NOT NULL,
    transfer_type_id            INTEGER         NOT NULL,
    value                       NUMERIC(15, 2)  NOT NULL CHECK (value > 0),
    status                      VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP
);

CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_account_debit ON transactions(account_external_id_debit);
CREATE INDEX idx_transactions_account_credit ON transactions(account_external_id_credit);
