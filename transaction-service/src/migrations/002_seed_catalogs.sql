INSERT INTO transaction_types (name) VALUES
  ('Transferencia entre cuentas propias'),
  ('Transferencia a terceros mismo banco'),
  ('Transferencia a terceros otros bancos')
ON CONFLICT (name) DO NOTHING;

INSERT INTO transaction_statuses (name) VALUES
  ('pending'),
  ('approved'),
  ('rejected')
ON CONFLICT (name) DO NOTHING;
