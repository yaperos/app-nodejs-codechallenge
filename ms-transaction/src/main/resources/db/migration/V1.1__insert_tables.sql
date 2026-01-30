INSERT INTO transaction_status (code, name)
VALUES ('PENDING', 'Pendiente'),
       ('APPROVED', 'Aprobado'),
       ('REJECTED', 'Rechazado');

INSERT INTO transfer_type (transfer_type_id, code, name)
VALUES (1, 'TRANSFER', 'Transferencia'),
       (2, 'PAYMENT', 'Pago'),
       (3, 'DEPOSIT', 'Depósito');
