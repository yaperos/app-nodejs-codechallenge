CREATE TABLE transactions (
	transactionId integer NOT NULL GENERATED ALWAYS AS IDENTITY,
	accountExternalIdDebit varchar NOT NULL,
	accountExternalIdCredit varchar NOT NULL,
	transferTypeId integer NOT NULL,
    transactionStatus integer NOT NULL,
	valueTransaction decimal(19,4) NOT NULL,
	createdAt date NULL
)