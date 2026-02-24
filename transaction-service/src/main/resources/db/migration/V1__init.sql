-- V1__init_schema.sql

-- ─── Transaction Types ─────────────────────────────────────────────────────────

CREATE TABLE transaction_types (
                                   id   SERIAL PRIMARY KEY,
                                   name VARCHAR(100) NOT NULL UNIQUE
);

-- Seed common types — extend as needed
INSERT INTO transaction_types (name) VALUES
                                         ('WIRE_TRANSFER'),
                                         ('ACH_TRANSFER'),
                                         ('INTERNAL_TRANSFER'),
                                         ('PAYMENT');

-- ─── Transactions ──────────────────────────────────────────────────────────────

CREATE TABLE transactions (
                              id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              value                      NUMERIC(19, 4)  NOT NULL CHECK (value > 0),
                              account_external_id_debit  UUID            NOT NULL,
                              account_external_id_credit UUID            NOT NULL,
                              transfer_type_id           INT             NOT NULL REFERENCES transaction_types(id),
                              status                     VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                                  CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
                              version                    BIGINT          NOT NULL DEFAULT 0,   -- Optimistic locking
                              created_at                 TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                              updated_at                 TIMESTAMPTZ
);

-- Query patterns we need to support efficiently
CREATE INDEX idx_transaction_status         ON transactions(status);
CREATE INDEX idx_transaction_created_at     ON transactions(created_at DESC);
CREATE INDEX idx_transaction_debit_account  ON transactions(account_external_id_debit);
CREATE INDEX idx_transaction_credit_account ON transactions(account_external_id_credit);

-- ─── Outbox Events ─────────────────────────────────────────────────────────────

CREATE TABLE outbox_events (
                               id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                               aggregate_id   VARCHAR(255) NOT NULL,
                               aggregate_type VARCHAR(100) NOT NULL,
                               event_type     VARCHAR(100) NOT NULL,
                               payload        TEXT         NOT NULL,
                               processed      BOOLEAN      NOT NULL DEFAULT FALSE,
                               retry_count    INT          NOT NULL DEFAULT 0,
                               last_error     TEXT,
                               created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
                               processed_at   TIMESTAMPTZ
);

-- Partial index only covers unprocessed rows — stays fast even with millions of historical rows
CREATE INDEX idx_outbox_unprocessed ON outbox_events(created_at ASC)
    WHERE processed = FALSE AND retry_count < 5;

CREATE INDEX idx_outbox_aggregate ON outbox_events(aggregate_id);

-- ─── Comments ──────────────────────────────────────────────────────────────────
COMMENT ON COLUMN transactions.version IS
    'Optimistic locking version. Incremented on every UPDATE by JPA/Hibernate.';

COMMENT ON TABLE outbox_events IS
    'Transactional Outbox. Events written atomically with domain data, '
    'then published to Kafka by a background poller. Guarantees at-least-once delivery.';

