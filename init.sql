-- create a table
CREATE TABLE transaction_entity(
  id TEXT PRIMARY KEY NOT NULL,
  account_external_id_debit TEXT NOT NULL,
  account_external_id_credit TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  transaction_status TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);