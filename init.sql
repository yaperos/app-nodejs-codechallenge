-- ===============================
-- CONNECT TO POSTGRES
-- ===============================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_database WHERE datname = 'dbtransactionv1'
    ) THEN
        CREATE DATABASE dbtransactionv1;
    END IF;
END
$$;

-- CONNECT
\c dbtransactionv1

-- EXTENSION PARA UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLA: TRANSACTION
CREATE TABLE IF NOT EXISTS public.transacciones
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_external_id UUID NOT NULL UNIQUE,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INTEGER NOT NULL,
    transaction_status VARCHAR(20) NOT NULL,
    value NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- INDICES
CREATE INDEX IF NOT EXISTS idx_transacciones_external_id
ON public.transacciones (transaction_external_id);

CREATE INDEX IF NOT EXISTS idx_transacciones_status
ON public.transacciones (transaction_status);

CREATE INDEX IF NOT EXISTS idx_transacciones_created_at
ON public.transacciones (created_at);

-- ===============================
-- PERMISSIONS
-- ===============================
GRANT CONNECT ON DATABASE dbtransactionv1 TO PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE dbtransactionv1 TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
