-- 1 funcion que actualiza cuando hay un update del row
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 2. Trigger que ejecuta el evento

DROP TRIGGER IF EXISTS trg_set_updated_at ON transactions;

CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();