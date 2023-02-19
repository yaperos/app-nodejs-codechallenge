CREATE TABLE transactions
(
    id                         uuid           not null primary key,
    account_external_id_debit  uuid           not null,
    account_external_id_credit uuid           not null,
    transfer_type_id           int            not null,
    value                      decimal(18, 6) not null,
    status                     varchar(10)    not null,
    created_at                 timestamp      not null,
    updated_at                 timestamp      not null
);
CREATE INDEX IF NOT EXISTS transactions_id_idx ON transactions (id);
