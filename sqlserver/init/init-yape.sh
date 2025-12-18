#!/bin/bash
set -e

# Detectar la ruta correcta de sqlcmd
if [ -x /opt/mssql-tools18/bin/sqlcmd ]; then
  SQLCMD="/opt/mssql-tools18/bin/sqlcmd"
elif [ -x /opt/mssql-tools/bin/sqlcmd ]; then
  SQLCMD="/opt/mssql-tools/bin/sqlcmd"
else
  echo "ERROR: sqlcmd no encontrado en /opt/mssql-tools*/bin"
  exit 1
fi

# Arrancar SQL Server en background
/opt/mssql/bin/sqlservr &

echo "Waiting for SQL Server to be ready..."
# Esperar hasta que responda
until $SQLCMD -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1
do
  sleep 1
done

echo "Sleep for 20 seconds to wait all in database is ready..."
sleep 20

echo "Running init-yape.sql..."
$SQLCMD -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d master -i /usr/src/init/init-yape.sql

echo "Init script finished successfully. SQL Server continues running."
wait