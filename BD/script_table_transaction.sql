-- Table: accounts.transactions

-- DROP TABLE accounts.transactions;

CREATE TABLE IF NOT EXISTS accounts.transactions
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    accountexternaliddebit character varying(100) COLLATE pg_catalog."default" NOT NULL,
    accountexternalidcredit character varying(100) COLLATE pg_catalog."default" NOT NULL,
    transactiontypeid bigint NOT NULL,
    transactionstatusid bigint NOT NULL,
    value numeric(16,0),
    active character(1) COLLATE pg_catalog."default" NOT NULL,
    createdby character varying(30) COLLATE pg_catalog."default" NOT NULL,
    createdat timestamp without time zone NOT NULL,
    updatedby character varying(30) COLLATE pg_catalog."default",
    updatedat timestamp without time zone,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_status_fkey FOREIGN KEY (transactionstatusid)
        REFERENCES accounts.transactions_statuses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT transactions_type_fkey FOREIGN KEY (transactiontypeid)
        REFERENCES accounts.transactions_types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE accounts.transactions
    OWNER to postgres;

COMMENT ON TABLE accounts.transactions
    IS 'Table for transactions';