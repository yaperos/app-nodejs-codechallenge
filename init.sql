CREATE TABLE IF NOT EXISTS account (
  id UUID PRIMARY KEY
);

INSERT INTO account (id) VALUES
  ('cf345b9d-c280-4bc0-b19e-c21d601b8211'),
  ('d8d0a0f3-438b-4748-a4b4-c95cc845faee'),
  ('3a07e308-39f1-494c-9a4b-c78b7dc3dc5d');

CREATE TABLE IF NOT EXISTS transaction (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,
  transfer_type_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  status VARCHAR NOT NULL,
  account_external_id_debit_id UUID REFERENCES account(id),
  account_external_id_credit_id UUID REFERENCES account(id)
);