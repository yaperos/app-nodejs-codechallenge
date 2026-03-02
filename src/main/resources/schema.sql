CREATE TABLE IF NOT EXISTS transactions (
    transaction_external_id UUID PRIMARY KEY,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INT NOT NULL,
    value DECIMAL(19, 4) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);