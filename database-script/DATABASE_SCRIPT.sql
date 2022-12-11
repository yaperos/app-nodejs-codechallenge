CREATE DATABASE transaction;

CREATE TABLE "transaction" (
	id serial4 NOT NULL,
	"type" varchar(50) NOT NULL,
	status varchar(50) NOT NULL,
	created_at timestamp NULL,
	account_debit_id varchar(100) NULL,
	account_credit_id varchar(100) NULL,
	uuid varchar(100) NOT NULL,
	CONSTRAINT transaction_pk PRIMARY KEY (id)
);

CREATE UNIQUE INDEX transaction_uuid_uindex ON transaction USING btree (uuid);

INSERT INTO "transaction" (amount,"type",status,created_at,account_debit_id,account_credit_id,uuid) VALUES
	 (10000.00,'1','3','2022-12-07 13:06:08.83',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','cd3d8b5a-0a01-48d2-8d48-f2c3669a3de2'),
	 (10000.00,'1','3','2022-12-07 13:20:32.122',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','dfea1c62-b0fc-477e-a412-de7cadc2e64f'),
	 (10000.00,'1','3','2022-12-07 13:21:36.78',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','4694aedd-a28d-4956-8ae4-5be46d582d20'),
	 (10000.00,'1','3','2022-12-07 13:28:56.21',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','3bb02e6b-68e6-4e2a-8c61-aeab2ac90de3'),
	 (10000.00,'1','3','2022-12-07 14:03:12.549',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','e1f64ed6-ea87-40bf-bc5c-119b5fde0eb9'),
	 (10000.00,'1','3','2022-12-07 14:11:15.887',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','e06b7906-3bb4-463d-8f4c-0398b03dd2ba'),
	 (10000.00,'1','3','2022-12-07 14:55:03.628',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','317ddefe-d372-4127-89e4-e6e12dd4dcb6'),
	 (10000.00,'1','3','2022-12-07 15:24:22.096',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','edd7b78c-6432-4c1a-a7da-b6fde2a26e15'),
	 (10000.00,'1','3','2022-12-07 15:37:50.191',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','f487a8a6-273c-4730-8a92-ce9da375a99b'),
	 (10000.00,'1','3','2022-12-07 16:12:29.089',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','c429e590-19db-47bb-8435-3175e8194600');
INSERT INTO public."transaction" (amount,"type",status,created_at,account_debit_id,account_credit_id,uuid) VALUES
	 (10000.00,'2','3','2022-12-07 16:12:37.169',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','d63c2d89-81f5-472c-89c9-0f202253dc6a'),
	 (999.00,'2','2','2022-12-07 16:13:08.581',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','7337900f-9372-4a7c-8022-a6d5176a9806'),
	 (999.91,'2','2','2022-12-07 16:13:13.651',NULL,'d149238a-746f-11ed-a1eb-0242ac120002','d46fa1f2-0c6a-4b0b-98a4-55931783c786');


