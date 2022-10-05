-- Table: accounts.transactions_statuses

-- DROP TABLE accounts.transactions_statuses;

CREATE TABLE IF NOT EXISTS accounts.transactions_statuses
(
    id bigint NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    active character(1) COLLATE pg_catalog."default" NOT NULL,
    createdby character varying(30) COLLATE pg_catalog."default" NOT NULL,
    createdat timestamp without time zone NOT NULL,
    updatedby character varying(30) COLLATE pg_catalog."default",
    updatedat timestamp without time zone,
    CONSTRAINT transactions_statuses_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE accounts.transactions_statuses
    OWNER to postgres;

COMMENT ON TABLE accounts.transactions_statuses
    IS 'Table for transactions statuses';
	

-- Insert Transaction statuses
INSERT INTO accounts.transactions_statuses (id, name, active, createdby, createdat) 
VALUES 
	(1, 'Pending', '1', 'System', now()),
	(2, 'Approved', '1', 'System', now()),
	(3, 'Rejected', '1', 'System', now());