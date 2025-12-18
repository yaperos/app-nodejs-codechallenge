------------------------------------------------------------
-- 1. Crear BD YAPE si no existe
------------------------------------------------------------
IF DB_ID(N'YAPE') IS NULL
BEGIN
    PRINT 'Creating database YAPE...';
    CREATE DATABASE [YAPE];
END
ELSE
BEGIN
    PRINT 'Database YAPE already exists.';
END
GO

------------------------------------------------------------
-- 2. Esperar a que la BD YAPE esté ONLINE
------------------------------------------------------------
PRINT 'Ensuring database YAPE is ONLINE...';

-- Esperar a que aparezca en sys.databases
WHILE DB_ID(N'YAPE') IS NULL
BEGIN
    PRINT 'Database YAPE not created yet. Waiting 1 second...';
    WAITFOR DELAY '00:00:01';
END

-- Esperar a que su estado sea ONLINE
WHILE EXISTS (
    SELECT 1
    FROM sys.databases
    WHERE name = N'YAPE'
    AND state_desc <> 'ONLINE'  -- state_desc = ONLINE, RESTORING, RECOVERING, etc.
)
BEGIN
    PRINT 'Database YAPE is not ONLINE yet. Waiting 1 second...';
    WAITFOR DELAY '00:00:01';
END

PRINT 'Database YAPE is ONLINE.';
GO

------------------------------------------------------------
-- 3. Cambiar el contexto a YAPE
------------------------------------------------------------
USE [YAPE];
GO

------------------------------------------------------------
-- 4. Crear tabla dbo.transactions si no existe
------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM YAPE.sys.tables WHERE name = N'transactions' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
    PRINT 'Creating table dbo.transactions...';

    CREATE TABLE YAPE.dbo.[transactions] (
        id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_transactions PRIMARY KEY,
		transaction_external_id UNIQUEIDENTIFIER NOT NULL,
		account_external_id_debit  VARCHAR(36) NOT NULL,
        account_external_id_credit VARCHAR(36) NOT NULL,
		transaction_type_id INT NOT NULL,
		transaction_status VARCHAR(20) NOT NULL,
		value DECIMAL(18,2) NOT NULL,
		created_at DATETIME2(0) NOT NULL CONSTRAINT DF_transactions_created_at DEFAULT SYSUTCDATETIME(),
		updated_at DATETIME2(0) NULL
    );

    -- UNIQUE en transaction_external_id
    ALTER TABLE YAPE.dbo.[transactions] 
	ADD CONSTRAINT UQ_transactions_transaction_external_id 
	UNIQUE (transaction_external_id);

    -- CHECK para los estados válidos
    ALTER TABLE YAPE.dbo.[transactions] 
	ADD CONSTRAINT CK_transactions_status 
	CHECK (transaction_status IN ('PENDING','APPROVED','REJECTED'));
END
ELSE
BEGIN
    PRINT 'Table YAPE.dbo.transactions already exists.';
END
GO

------------------------------------------------------------
-- 5. Trigger para updated_at en cada UPDATE
------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1
    FROM YAPE.sys.triggers
    WHERE name = N'trg_transactions_set_updated_at'
    AND parent_id = OBJECT_ID(N'[YAPE].dbo.[transactions]')
)
BEGIN
    PRINT 'Creating trigger YAPE.dbo.trg_transactions_set_updated_at...';

    EXEC ('
        CREATE TRIGGER dbo.trg_transactions_set_updated_at
        ON YAPE.dbo.[transactions]
        AFTER UPDATE
        AS
        BEGIN
            SET NOCOUNT ON;

            UPDATE t
            SET updated_at = SYSUTCDATETIME()
            FROM YAPE.dbo.[transactions] t
            JOIN inserted i ON t.id = i.id;
        END
    ');
END
ELSE
BEGIN
    PRINT 'Trigger YAPE.dbo.trg_transactions_set_updated_at already exists.';
END
GO