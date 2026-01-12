CREATE TABLE IF NOT EXISTS transaction (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_account_id uuid NOT NULL,
    created_at bigint NOT NULL,
    destination_account_id uuid NOT NULL,
    status text NOT NULL,
    type text NOT NULL,
    amount float NOT NULL
);