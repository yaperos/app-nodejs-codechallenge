CREATE TABLE IF NOT EXISTS transaction_status
(
    transaction_status_id SERIAL PRIMARY KEY,
    code                  VARCHAR(20) NOT NULL UNIQUE,
    name                  VARCHAR(50) NOT NULL,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transfer_type
(
    transfer_type_id SERIAL PRIMARY KEY,
    code             VARCHAR(20) NOT NULL UNIQUE,
    name             VARCHAR(50) NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction
(
    transaction_id             SERIAL PRIMARY KEY,
    transaction_external_id    UUID           NOT NULL UNIQUE,
    account_external_id_debit  UUID           NOT NULL,
    account_external_id_credit UUID           NOT NULL,
    transfer_type_id           INT            NOT NULL,
    transaction_status_id      INT            NOT NULL,
    value                      DECIMAL(19, 4) NOT NULL,
    created_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transfer_type FOREIGN KEY (transfer_type_id)
        REFERENCES transfer_type (transfer_type_id),
    CONSTRAINT fk_transaction_status FOREIGN KEY (transaction_status_id)
        REFERENCES transaction_status (transaction_status_id),
    CONSTRAINT chk_value CHECK (value > 0)
);