CREATE TABLE evaluated_transactions (
    transaction_id UUID PRIMARY KEY,
    status         VARCHAR(20) NOT NULL,
    evaluated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
