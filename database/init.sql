-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS yape_challenge;

-- Use the database
\c yape_challenge;

-- Create transaction_types table
CREATE TABLE IF NOT EXISTS transaction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Create transaction_statuses table
CREATE TABLE IF NOT EXISTS transaction_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_external_id VARCHAR(255) UNIQUE NOT NULL,
    account_external_id_debit VARCHAR(255) NOT NULL,
    account_external_id_credit VARCHAR(255) NOT NULL,
    transfer_type_id INTEGER NOT NULL REFERENCES transaction_types(id),
    value DECIMAL(10,2) NOT NULL,
    status_id INTEGER DEFAULT 1 REFERENCES transaction_statuses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar tipos de transacción
INSERT INTO transaction_types (id, name, description) VALUES 
(1, 'Transfer', 'Transferencia entre cuentas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO transaction_types (id, name, description) VALUES 
(2, 'Payment', 'Transacción de pago') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO transaction_types (id, name, description) VALUES 
(3, 'Withdrawal', 'Transacción de retiro') 
ON CONFLICT (name) DO NOTHING;

-- Insertar estados de transacción
INSERT INTO transaction_statuses (id, name, description) VALUES 
(1, 'pending', 'Transacción pendiente') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO transaction_statuses (id, name, description) VALUES 
(2, 'approved', 'Transacción aprobada') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO transaction_statuses (id, name, description) VALUES 
(3, 'rejected', 'Transacción rechazada') 
ON CONFLICT (name) DO NOTHING;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_transactions_external_id ON transactions(transaction_external_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Actualizar valores de secuencias para asegurar que empiecen después de los valores insertados
SELECT setval('transaction_types_id_seq', (SELECT MAX(id) FROM transaction_types));
SELECT setval('transaction_statuses_id_seq', (SELECT MAX(id) FROM transaction_statuses)); 