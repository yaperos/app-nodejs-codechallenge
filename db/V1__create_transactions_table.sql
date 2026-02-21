CREATE TABLE IF NOT EXISTS transactions(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_external_id UUID UNIQUE NOT NULL,
    account_external_id_debit UUID NOT NULL,
    account_external_id_credit UUID NOT NULL,
    transfer_type_id INT NOT NULL,
    value NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL

);