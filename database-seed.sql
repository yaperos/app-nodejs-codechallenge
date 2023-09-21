DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS transaction_types;

CREATE TABLE transaction_types
(
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE transactions
(
  id INT GENERATED ALWAYS AS IDENTITY,
  status VARCHAR(55) NOT NULL,
  type_id INT,
  value DECIMAL,
  created_at DATE,
  PRIMARY KEY (id),
  CONSTRAINT fk_type
      FOREIGN KEY(type_id)
	      REFERENCES transaction_types(id)
);

INSERT INTO transaction_types(name) VALUES
('Type 1'),
('Type 2'),
('Type 3');