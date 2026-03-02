CREATE TABLE IF NOT EXISTS transactions (
    id                         BIGSERIAL PRIMARY KEY,
    transaction_external_id    UUID         NOT NULL UNIQUE,
    account_external_id_debit  UUID         NOT NULL,
    account_external_id_credit UUID         NOT NULL,
    transaction_type           VARCHAR(50)  NOT NULL,
    transaction_type_id        INTEGER      NOT NULL,
    transaction_status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    value                      NUMERIC(19,4) NOT NULL,
    created_at                 TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_external_id
    ON transactions (transaction_external_id);

CREATE INDEX IF NOT EXISTS idx_transactions_status
    ON transactions (transaction_status);
