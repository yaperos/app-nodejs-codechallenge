CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA "anti_fraud";


CREATE TABLE "anti_fraud".transaction (
    transaction_external_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INT NOT NULL,
    value NUMERIC(18,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL
);

-- Restricción para estados válidos
ALTER TABLE "anti_fraud".transaction
ADD CONSTRAINT chk_transaction_status
CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));

-- Índices recomendados
CREATE INDEX idx_transaction_status ON "anti_fraud".transaction(status);
CREATE INDEX idx_transaction_debit ON "anti_fraud".transaction(account_external_id_debit);
CREATE INDEX idx_transaction_credit ON "anti_fraud".transaction(account_external_id_credit);
CREATE INDEX idx_transaction_created_at ON "anti_fraud".transaction(created_at);
