CREATE TABLE transfer_types (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO transfer_types (name) VALUES ('TRANSFER');
