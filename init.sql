DROP TABLE IF EXISTS TypeTransaction;

CREATE TABLE TypeTransaction (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) 
);


INSERT INTO TypeTransaction (name) VALUES
('typeOne'),
('typeTwo'),
('typeThree');

DROP TABLE IF EXISTS transaction;

CREATE TABLE "Transaction" (
  "id" UUID PRIMARY KEY,
  "accountExternalIdDebit" VARCHAR(50),
  "accountExternalIdCredit" VARCHAR(50),
  "tranferTypeId" INT,
  "value" NUMERIC,
  "status" VARCHAR(255) DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);