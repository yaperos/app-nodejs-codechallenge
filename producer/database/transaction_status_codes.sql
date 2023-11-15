-- public.transaction_status_codes definition

-- Drop table

-- DROP TABLE public.transaction_status_codes;

CREATE TABLE public.transaction_status_codes (
	id numeric NOT NULL,
	"name" varchar NULL,
	CONSTRAINT transaction_status_codes_pk PRIMARY KEY (id)
);
CREATE INDEX transaction_status_codes_id_idx ON public.transaction_status_codes USING btree (id);