-- Crear base de datos si no existe
SELECT 'CREATE DATABASE transactions_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'transactions_db')\gexec

-- Conectar a la base de datos
\c transactions_db;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_external_id UUID UNIQUE NOT NULL,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INTEGER NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_transaction_external_id ON transactions(transaction_external_id);
CREATE INDEX IF NOT EXISTS idx_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_value ON transactions(value);

-- Crear tabla para logs de auditoría
CREATE TABLE IF NOT EXISTS transaction_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_external_id UUID NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(100),
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_external_id) REFERENCES transactions(transaction_external_id)
);

-- Crear tabla para estadísticas
CREATE TABLE IF NOT EXISTS transaction_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    total_approved INTEGER DEFAULT 0,
    total_rejected INTEGER DEFAULT 0,
    total_pending INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    avg_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para estadísticas
CREATE INDEX IF NOT EXISTS idx_stats_date ON transaction_stats(date);

-- Insertar datos de ejemplo para desarrollo
INSERT INTO transactions (transaction_external_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value, status) VALUES
    ('123e4567-e89b-12d3-a456-426614174000', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 500.00, 'approved'),
    ('123e4567-e89b-12d3-a456-426614174001', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 2, 1500.00, 'rejected'),
    ('123e4567-e89b-12d3-a456-426614174002', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 3, 750.00, 'approved')
ON CONFLICT (transaction_external_id) DO NOTHING;

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar timestamp automáticamente
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();