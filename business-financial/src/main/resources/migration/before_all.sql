CREATE DATABASE financial_db;

CREATE TABLE financial_db.public.event_store (
    id BIGSERIAL PRIMARY KEY,
    transaction_id UUID NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_version_per_transaction UNIQUE (transaction_id, event_type)
);

CREATE INDEX idx_transaction_id ON financial_db.public.event_store(transaction_id);