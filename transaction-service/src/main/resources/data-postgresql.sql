-- Datos iniciales de estados
INSERT INTO transaction_status (name) 
SELECT 'PENDING' WHERE NOT EXISTS (SELECT 1 FROM transaction_status WHERE name = 'PENDING');

INSERT INTO transaction_status (name) 
SELECT 'APPROVED' WHERE NOT EXISTS (SELECT 1 FROM transaction_status WHERE name = 'APPROVED');

INSERT INTO transaction_status (name) 
SELECT 'REJECTED' WHERE NOT EXISTS (SELECT 1 FROM transaction_status WHERE name = 'REJECTED');

-- Datos iniciales de tipos
INSERT INTO transaction_type (name) 
SELECT 'transfer' WHERE NOT EXISTS (SELECT 1 FROM transaction_type WHERE name = 'transfer');