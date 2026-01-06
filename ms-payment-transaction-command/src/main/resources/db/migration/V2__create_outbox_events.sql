create table if not exists outbox_events (
                                             id bigserial primary key,
                                             aggregate_type varchar(50) not null,
    aggregate_id uuid not null,
    event_type varchar(100) not null,
    topic varchar(200) not null,
    payload jsonb not null,
    status varchar(20) not null,
    error text null,
    created_at timestamptz not null default now(),
    published_at timestamptz null
    );

create index if not exists ix_outbox_status_created_at
    on outbox_events (status, created_at);

create index if not exists ix_outbox_aggregate_event
    on outbox_events (aggregate_id, event_type);