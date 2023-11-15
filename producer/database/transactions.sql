-- public.transactions definition

-- Drop table

-- DROP TABLE public.transactions;

CREATE TABLE public.transactions (
	id bigserial NOT NULL,
	account_external_id_debit uuid NOT NULL,
	account_external_id_credit uuid NOT NULL,
	transfer_type_id numeric NOT NULL,
	transfer_status_id numeric NOT NULL,
	value numeric NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	transaction_id uuid NOT NULL,
	updated_at timestamp NULL,
	CONSTRAINT transactions_pk PRIMARY KEY (transaction_id)
);