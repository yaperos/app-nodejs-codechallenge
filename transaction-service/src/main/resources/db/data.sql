-- PostgreSQL data initialization
-- This script inserts initial data AFTER the schema is created

-- Insert default transaction types (only if not exists)
INSERT INTO transaction_types (name, description)
VALUES
    ('TRANSFER', 'Transfer between accounts'),
    ('PAYMENT', 'Payment transaction'),
    ('WITHDRAWAL', 'Cash withdrawal'),
    ('DEPOSIT', 'Cash deposit')
ON CONFLICT (name) DO NOTHING;

