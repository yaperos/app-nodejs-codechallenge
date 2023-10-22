
\c "transaction";

CREATE TABLE public.transaction_status (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY (id)
);

-- Permissions
ALTER TABLE public.transaction_status OWNER TO postgres;
GRANT ALL ON TABLE public.transaction_status TO postgres;

INSERT INTO public.transaction_status VALUES (1, 'pendiente');
INSERT INTO public.transaction_status VALUES (2, 'aprobado');
INSERT INTO public.transaction_status VALUES (3, 'rechazado');


CREATE TABLE public.transaction_type (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY (id)
);

-- Permissions
ALTER TABLE public.transaction_type OWNER TO postgres;
GRANT ALL ON TABLE public.transaction_type TO postgres;

INSERT INTO public.transaction_type VALUES (1, 'normal');
INSERT INTO public.transaction_type VALUES (2, 'inmediata');

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public."transaction" (
	"transactionExternalId" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"accountExternalIdDebit" uuid NOT NULL,
	"accountExternalIdCredit" uuid NOT NULL,
	value float8 NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"tranferTypeId" int4 NULL,
	"transactionStatusId" int4 NULL,
	CONSTRAINT "PK_e9d33ad38b57ee3c0b6af71e061" PRIMARY KEY ("transactionExternalId")
);

-- Permissions

ALTER TABLE public."transaction" OWNER TO postgres;
GRANT ALL ON TABLE public."transaction" TO postgres;


-- public."transaction" foreign keys

ALTER TABLE public."transaction" ADD CONSTRAINT "FK_8e2274441c9515105019570ef79" FOREIGN KEY ("tranferTypeId") REFERENCES public.transaction_type(id);
ALTER TABLE public."transaction" ADD CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc" FOREIGN KEY ("transactionStatusId") REFERENCES public.transaction_status(id);