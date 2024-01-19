CREATE DATABASE yape
   WITH 
   OWNER = postgres
   ENCODING = 'UTF8'
   LC_COLLATE = 'en_US.utf8'
   LC_CTYPE = 'en_US.utf8'
   TABLESPACE = pg_default
   CONNECTION LIMIT = -1;
\c yape;

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    accountExternalIdDebit VARCHAR(255) NOT NULL,
    accountExternalIdCredit VARCHAR(255) NOT NULL,
    transferTypeId INT NOT NULL,
    transactionExternalId VARCHAR(255) NOT NULL,
    transactionType VARCHAR(255) DEFAULT NULL,
    value DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT NULL
);
