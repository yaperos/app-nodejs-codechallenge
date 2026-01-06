-- Insertar estados de transacción
INSERT INTO transaction_status (name) VALUES
    ('pending'),
    ('approved'),
    ('rejected');

-- Insertar tipos de transacción
INSERT INTO transaction_type (name) VALUES
    ('transfer'),
    ('deposit'),
    ('withdrawal');

