CREATE TABLE antifraude (
  id          bigserial,
  uuid        uuid,
  transactionValue       numeric(7, 2) DEFAULT 0.0,
  transactionStatus   numeric,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW()
);
