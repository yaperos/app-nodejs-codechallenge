DROP TABLE IF EXISTS TypeTransaction;

CREATE TABLE TypeTransaction (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


INSERT INTO TypeTransaction (name) VALUES
('typeOne'),
('typeTwo'),
('typeThree');
