DO $$ BEGIN
 CREATE TYPE "transaction_status_name_enum" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "transaction_type_name_enum" AS ENUM('debit', 'credit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "transactions" (
	"transaction_external_id" uuid PRIMARY KEY NOT NULL,
	"transaction_type_name" transaction_type_name_enum NOT NULL,
	"transaction_status_name" transaction_status_name_enum NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
