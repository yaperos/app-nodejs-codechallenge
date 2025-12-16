CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_external_id_debit  UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,

    transfer_type_id INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL,

    value NUMERIC(19, 2) NOT NULL CHECK (value > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);