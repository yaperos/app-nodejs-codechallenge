CREATE TABLE IF NOT EXISTS transfer_types (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transfer_types (id, name, description) VALUES
    (1, 'Transfer', 'Standard bank transfer'),
    (2, 'Payment', 'Payment for services or goods'),
    (3, 'Deposit', 'Cash or check deposit'),
    (4, 'Withdrawal', 'Cash withdrawal')
ON CONFLICT (id) DO NOTHING;

