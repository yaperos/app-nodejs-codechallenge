CREATE DATABASE transaction_command_db;

\c transaction_command_db;

CREATE TABLE IF NOT EXISTS public.transactions (
    transaction_external_id UUID NOT NULL,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    tranfer_type_id INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    status VARCHAR(8),
    create_at TIMESTAMP NOT NULL,
    PRIMARY KEY (transaction_external_id)
)
