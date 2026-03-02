CREATE TABLE transaction (
    transaction_external_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_external_id_debit BIGINT,
    account_external_id_credit BIGINT,
    transfer_type_id INT,
    amount DOUBLE,
    created_at TIMESTAMP
);

CREATE TABLE transaction_type (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE transaction_status (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);