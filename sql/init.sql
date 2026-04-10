CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  country VARCHAR(8) NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outbox_events (
  id UUID PRIMARY KEY,
  aggregate_id UUID NOT NULL,
  aggregate_type VARCHAR(50) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  event_version INT NOT NULL,
  payload JSONB NOT NULL,
  headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  retry_count INT NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMP NULL,
  published_at TIMESTAMP NULL,
  last_error TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbox_status_next_retry
  ON outbox_events(status, next_retry_at, created_at);

CREATE TABLE IF NOT EXISTS payment_processing_status (
  payment_id UUID PRIMARY KEY,
  fraud_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  ledger_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  final_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  failure_reason TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consumer_processed_events (
  consumer_name VARCHAR(100) NOT NULL,
  event_id UUID NOT NULL,
  aggregate_id UUID NOT NULL,
  processed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (consumer_name, event_id)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY,
  payment_id UUID NOT NULL,
  debit_account VARCHAR(100) NOT NULL,
  credit_account VARCHAR(100) NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  currency VARCHAR(8) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  payment_id UUID NOT NULL,
  channel VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
