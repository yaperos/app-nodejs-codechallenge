-- V1__create_transaction_table.sql
-- Autor: lmarusic
-- Version: 1.0.0

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_external_id UUID NOT NULL UNIQUE,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INTEGER NOT NULL,
    value NUMERIC(19,2) NOT NULL CHECK (value > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_transaction_external_id ON transactions(transaction_external_id);

-- Necesario para el conector kafka - debezium
ALTER TABLE transactions REPLICA IDENTITY FULL;
