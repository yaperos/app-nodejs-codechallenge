CREATE TABLE transactions (
  id UUID PRIMARY KEY NOT NULL,
  transfer_type_id INTEGER NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  account_external_id_debit UUID,
  account_external_id_credit UUID,
  created_at DATE NOT NULL
);
