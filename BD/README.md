1.- Levantar la Instancia de la BD Postgresql
2.- Conectarse al server  Postgres desde CMD o una terminal (según el sistema operativo):
		psql -h [IP] -U postgres -p [PORT]
		Leyenda:
			IP: Ip del server postgres
			Port: Puerto del server postgres
3.- Ejecutar los script de creación en la siguiente secuencia:
	- script_database_create.sql
	- script_schema_create.sql
	- script_table_transactions_types.sql
	- script_table_transactions_statuses.sql
	- script_table_transaction.sql