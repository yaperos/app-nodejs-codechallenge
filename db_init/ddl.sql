CREATE EXTENSION IF NOT EXISTS pgcrypto;
------------------------------------------
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS transaction_types;
DROP TYPE IF EXISTS transaction_status;
------------------------------------------
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE transaction_types
(
    id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE transactions
(
    transaction_id             UUID PRIMARY KEY,
    account_external_id_debit  UUID               NOT NULL,
    account_external_id_credit UUID               NOT NULL,
    transfer_type_id           INTEGER            NOT NULL REFERENCES transaction_types (id),
    status                     TRANSACTION_STATUS NOT NULL DEFAULT 'pending',
    value                      NUMERIC(18, 2)     NOT NULL,
    created_at                 TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    deleted_at                 TIMESTAMPTZ,
    CONSTRAINT chk_value_non_zero_or_negative CHECK (value > 0)
--     CONSTRAINT chk_value_non_max CHECK (value <= 1000)
);

-- Indexes
CREATE INDEX idx_transactions_transfer_type_id ON transactions (transfer_type_id);
CREATE INDEX idx_transactions_status ON transactions (status);
CREATE INDEX idx_transactions_created_at ON transactions (created_at);
CREATE INDEX idx_transactions_acc_debit ON transactions (account_external_id_debit);
CREATE INDEX idx_transactions_acc_credit ON transactions (account_external_id_credit);
------------------------------------------

INSERT INTO transaction_types (name)
VALUES ('deposit'),
       ('withdrawal');

INSERT INTO transactions
(transaction_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 1, 0.50);

INSERT INTO transactions
(transaction_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 1, 50);

INSERT INTO transactions
(transaction_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 1, 180);

INSERT INTO transactions
(transaction_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 1, 420);

INSERT INTO transactions
(transaction_id, account_external_id_debit, account_external_id_credit, transfer_type_id, value)
VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 1, 1100);

------------------------------------------
ALTER TYPE transaction_status
    ADD VALUE IF NOT EXISTS 'in_review' BEFORE 'approved';

SELECT unnest(enum_range(NULL::transaction_status)) AS status;

SELECT *
FROM transactions
WHERE status = 'pending'::transaction_status;


-- ALTER TABLE transactions
--   DROP CONSTRAINT IF EXISTS chk_value_non_max;
--
-- ALTER TABLE transactions
--   ADD CONSTRAINT chk_value_non_max CHECK (value <= 1000);


------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'transaction_data_writer') THEN
CREATE ROLE transaction_data_writer;
END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_usr_transactions_dev') THEN
    CREATE USER app_usr_transactions_dev WITH PASSWORD '<STRONG_PASSWORD>';
END IF;
END$$;


GRANT CONNECT ON DATABASE "yape-ms-transactions-dev" TO transaction_data_writer;
GRANT USAGE ON SCHEMA public TO transaction_data_writer;
GRANT SELECT, INSERT, UPDATE, REFERENCES ON ALL TABLES IN SCHEMA public TO transaction_data_writer;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO transaction_data_writer;

GRANT transaction_data_writer TO app_usr_transactions_dev;
