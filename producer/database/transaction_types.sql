-- public.transaction_types definition

-- Drop table

-- DROP TABLE public.transaction_types;

CREATE TABLE public.transaction_types (
	id numeric NOT NULL,
	"name" varchar NULL,
	CONSTRAINT transaction_types_pk PRIMARY KEY (id)
);
CREATE INDEX transaction_types_id_idx ON public.transaction_types USING btree (id);