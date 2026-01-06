-- Tabla de tipos de transacción
CREATE TABLE transaction_type (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estados de transacción
CREATE TABLE transaction_status (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
        CHECK (name IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de transacciones
CREATE TABLE transaction (
    id BIGSERIAL PRIMARY KEY,
    transaction_external_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id BIGINT NOT NULL REFERENCES transaction_type(id),
    transaction_status_id BIGINT NOT NULL REFERENCES transaction_status(id),
    value DECIMAL(19,2) NOT NULL CHECK (value > 0),
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_transaction_external_id ON transaction(transaction_external_id);
CREATE INDEX idx_transaction_status ON transaction(transaction_status_id);
CREATE INDEX idx_transaction_created_at ON transaction(created_at DESC);
CREATE INDEX idx_transaction_debit_account ON transaction(account_external_id_debit);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en cada UPDATE
CREATE TRIGGER update_transaction_updated_at
    BEFORE UPDATE ON transaction
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

