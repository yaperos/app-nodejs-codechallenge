CREATE KEYSPACE IF NOT EXISTS yape_challenge WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE IF NOT EXISTS yape_challenge.transaction_by_account (
    source_account_id uuid,
    created_at bigint,
    transaction_id uuid,
    destination_account_id uuid,
    status text,
    type text,
    amount float,
    PRIMARY KEY (source_account_id, created_at, transaction_id)
) WITH CLUSTERING ORDER BY (created_at DESC, transaction_id ASC);