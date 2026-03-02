CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    external_id     UUID NOT NULL UNIQUE,
    account_debit   UUID NOT NULL,
    account_credit  UUID NOT NULL,
    transfer_type_id INT NOT NULL,
    value           DECIMAL(15,2) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP
);

CREATE INDEX idx_transactions_external_id ON transactions(external_id);
