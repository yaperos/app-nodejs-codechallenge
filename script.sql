DROP DATABASE IF EXISTS db_yape;
CREATE DATABASE db_yape;
\c db_yape

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE transaction_status (
    transaction_status_id int4 primary KEY,
	key varchar(100) NOT NULL,
	name varchar(100) NOT NULL,
	description varchar(250) NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "UQ_name_status" UNIQUE (name)
);

INSERT INTO transaction_status (transaction_status_id, name, description, key)
VALUES
  (1, 'Pendiente', 'La transaccion esta en estado pendiente.', 'pending'),
  (2, 'Aprobado', 'La transaccion ha sido aprobada.', 'approved'),
  (3, 'Rechazada', 'La transaccion ha sido rechazada.', 'rejected');

-- Crear la tabla transaction_types si no existe
CREATE TABLE transaction_types (
  transaction_type_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
created_at timestamp NOT NULL DEFAULT now(),
updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "UQ_name_types" UNIQUE (name)

);

-- Insertar datos en transaction_types
INSERT INTO transaction_types (transaction_type_id, name, key, description)
VALUES
  (1, 'Transferencia', 'transfer', 'Transferencia de Fondos.'),
  (2, 'Retiro', 'withdrawal', 'Retiro de Fondos.');


-- Crear Tabla transaccion
CREATE TABLE transactions (
	transaction_external_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	account_external_id_debit uuid NOT NULL,
	account_external_id_credit uuid NOT NULL,
	transaction_type_id int4 NOT NULL REFERENCES transaction_types(transaction_type_id),
	value float8 NOT NULL,
	transaction_status_id int4 NOT NULL REFERENCES transaction_status(transaction_status_id),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_id_transaction" PRIMARY KEY (transaction_external_id)
);
