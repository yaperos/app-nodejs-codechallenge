create table if not exists transactions (
                                            id bigserial primary key,
                                            transaction_external_id uuid not null,
                                            account_external_id_debit uuid not null,
                                            account_external_id_credit uuid not null,
                                            transfer_type_id integer not null,
                                            value numeric(18,2) not null,
    status varchar(20) not null,
    created_at timestamptz not null default now()
    );

create unique index if not exists ux_transactions_external_id
    on transactions (transaction_external_id);

create index if not exists ix_transactions_status_created_at
    on transactions (status, created_at);