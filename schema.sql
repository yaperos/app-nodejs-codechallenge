-- Yape Challenge - PostgreSQL schema
-- Target DB: yape (schema: public)
-- Notes:
-- 1) This script is idempotent (safe to re-run).
-- 2) Uses UUID as primary key: transaction_external_id.
-- 3) Includes optimistic locking column: version (BIGINT).
-- 4) Includes basic constraints and helpful indexes.

BEGIN;

-- Optional: ensure uuid generation functions exist (not required if app generates UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.transactions (
    transaction_external_id   UUID           NOT NULL,
    version                   BIGINT         NOT NULL DEFAULT 0,
    account_external_id_debit UUID           NOT NULL,
    account_external_id_credit UUID          NOT NULL,
    transfer_type_id          INTEGER        NOT NULL,
    value                     NUMERIC(18,2)  NOT NULL,
    status                    VARCHAR(20)    NOT NULL,
    created_at                TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT transactions_pkey PRIMARY KEY (transaction_external_id),
    CONSTRAINT transactions_value_positive CHECK (value >= 0),
    CONSTRAINT transactions_accounts_distinct CHECK (account_external_id_debit <> account_external_id_credit),
    CONSTRAINT transactions_status_valid CHECK (status IN ('PENDING','APPROVED','REJECTED'))
);

-- Helpful indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions (created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions (status);
CREATE INDEX IF NOT EXISTS idx_transactions_debit ON public.transactions (account_external_id_debit);
CREATE INDEX IF NOT EXISTS idx_transactions_credit ON public.transactions (account_external_id_credit);

COMMIT;
