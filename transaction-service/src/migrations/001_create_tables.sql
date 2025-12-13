CREATE TABLE IF NOT EXISTS transaction_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_external_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_external_id_debit UUID NOT NULL,
  account_external_id_credit UUID NOT NULL,
  transfer_type_id INT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  transaction_type_id INT REFERENCES transaction_types(id),
  transaction_status_id INT REFERENCES transaction_statuses(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
