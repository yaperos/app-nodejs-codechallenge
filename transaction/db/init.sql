-- CREATE DATABASE IF NOT EXISTS challenge
SELECT 'CREATE DATABASE challenge'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'challenge')\gexec

\c challenge

CREATE TABLE IF NOT EXISTS "transaction_status" (
  "id" SERIAL NOT NULL,
  "name" character varying(255) NOT NULL,
  CONSTRAINT "UQ_bdc1017b79532763afb7872a626" UNIQUE ("name"),
  CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id")
);

INSERT INTO "transaction_status" ("name") VALUES 
  ('pending'), 
  ('approved'), 
  ('rejected');

CREATE TABLE IF NOT EXISTS "transaction_type" (
  "id" SERIAL NOT NULL,
  "name" character varying(255) NOT NULL,
  CONSTRAINT "UQ_8705cb9b813ab0ae38cdf39c8ee" UNIQUE ("name"),
  CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id")
);

INSERT INTO "transaction_type" ("name") VALUES 
  ('Transfer to User'),
  ('Service'),
  ('Dollar sales'),
  ('Pay Mobile'),
  ('Personal credit'),
  ('Buy in Store');

CREATE TABLE IF NOT EXISTS "transfer_type" (
  "id" SERIAL NOT NULL,
  "name" character varying(255) NOT NULL,
  CONSTRAINT "UQ_ea0322172da119442dd70d6d03d" UNIQUE ("name"),
  CONSTRAINT "PK_e8079532c19bb535c33902388f1" PRIMARY KEY ("id")
);

INSERT INTO "transfer_type" ("name") VALUES 
  ('Immediate'),
  ('Scheduled');

CREATE TABLE IF NOT EXISTS "transaction" (
  "id" SERIAL NOT NULL,
  "transaction_external_id" character varying(36) NOT NULL,
  "account_external_id_debit" character varying(36),
  "account_external_id_credit" character varying(36),
  "transaction_type_id" integer NOT NULL,
  "transaction_status_id" integer NOT NULL,
  "transfer_type_id" integer NOT NULL,
  "value" numeric NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "update_at" TIMESTAMP,
  CONSTRAINT "UQ_bd9118a135878b66c8e2546ab04" UNIQUE ("transaction_external_id"),
  CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"),
  CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca" FOREIGN KEY ("transaction_type_id") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "FK_df972d66ba089168f1ffb0831ca" FOREIGN KEY ("transaction_status_id") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f" FOREIGN KEY ("transfer_type_id") REFERENCES "transfer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT INTO "transaction" ("transaction_external_id", "account_external_id_debit", "account_external_id_credit", "transaction_type_id", "transaction_status_id", "transfer_type_id", "value", "created_at") VALUES 
  ('transaction-0001', 'debit-0001', 'credit-0001', 1, 1, 1, 10, '2023-12-03 22:36:55.240'),
  ('transaction-0002', 'debit-0002', 'credit-0002', 2, 2, 2, 20, '2023-12-03 22:36:55.240'),
  ('transaction-0003', 'debit-0003', 'credit-0003', 3, 3, 1, 30, '2023-12-03 22:36:55.240'),
  ('transaction-0004', 'debit-0004', 'credit-0004', 4, 1, 2, 40, '2023-12-03 22:36:55.240'),
  ('transaction-0005', 'debit-0005', 'credit-0005', 5, 2, 1, 50, '2023-12-03 22:36:55.240'),
  ('transaction-0006', 'debit-0006', 'credit-0006', 6, 3, 2, 60, '2023-12-03 22:36:55.240');
