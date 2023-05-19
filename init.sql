CREATE TABLE transactions (
  transaction_external_id UUID PRIMARY KEY,
  account_external_id_debit VARCHAR(255),
  account_external_id_credit VARCHAR(255),
  transfer_type_id VARCHAR(255),
  value NUMERIC(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP
);