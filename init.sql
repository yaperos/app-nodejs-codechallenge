CREATE TABLE IF NOT EXISTS public.transactions (
	"transactionExternalId" uuid NOT NULL,
	"accountExternalIdDebit" uuid NOT NULL,
	"accountExternalIdCredit" uuid NOT NULL,
	"tranferTypeId" int4 NOT NULL,
	value float8 NOT NULL,
	status varchar NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT transactions_pk PRIMARY KEY ("transactionExternalId")
);
