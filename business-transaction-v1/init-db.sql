-- Script de inicialización de base de datos
-- Se ejecuta automáticamente cuando PostgreSQL inicia por primera vez

-- Crear el schema trx si no existe
CREATE SCHEMA IF NOT EXISTS trx;

-- Configurar el schema por defecto para el usuario postgres
ALTER USER postgres SET search_path TO trx, public;

-- Opcional: Crear algún índice o configuración adicional
-- CREATE INDEX IF NOT EXISTS idx_transaction_created_at ON trx.transaction(created_at);

-- Log de confirmación
SELECT 'Schema trx creado exitosamente' AS mensaje;
