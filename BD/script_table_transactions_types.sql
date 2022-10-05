-- Table: accounts.transactions_types

-- DROP TABLE accounts.transactions_types;

CREATE TABLE IF NOT EXISTS accounts.transactions_types
(
    id bigint NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    active character(1) COLLATE pg_catalog."default" NOT NULL,
    createdby character varying(30) COLLATE pg_catalog."default" NOT NULL,
    createdat timestamp without time zone NOT NULL,
    updatedby character varying(30) COLLATE pg_catalog."default",
    updatedat timestamp without time zone,
    CONSTRAINT transactions_types_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE accounts.transactions_types
    OWNER to postgres;

COMMENT ON TABLE accounts.transactions_types
    IS 'Table for transactions types';
	

-- Insert Transaction Types
INSERT INTO accounts.transactions_types (id, name, active, createdby, createdat) 
VALUES 
	(1, 'Financial Transaction', '1', 'ADMIN', now());