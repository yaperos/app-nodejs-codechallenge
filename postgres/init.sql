CREATE TABLE transactions (
    transaction_external_id VARCHAR(50) PRIMARY KEY,
    account_external_id_debit VARCHAR(50),
    account_external_id_credit VARCHAR(50),
    transaction_name VARCHAR(50),
    amount NUMERIC(18,2),
    transaction_status VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE transaction_events (
    id SERIAL PRIMARY KEY,
    transaction_external_id VARCHAR(50),
    account_external_id_debit VARCHAR(50),
    account_external_id_credit VARCHAR(50),
    transaction_name VARCHAR(50),
    amount NUMERIC(18,2),
    transaction_status VARCHAR(50),
    version INTEGER,
    created_at TIMESTAMP
);