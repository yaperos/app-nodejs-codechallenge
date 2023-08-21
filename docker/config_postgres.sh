#!/bin/bash

#Determina cuanta información de guarda en el WAL - replica: informacion minima + adicional para enviar los cambios a las replicas
docker exec -it pg-master bash -c "echo 'wal_level = replica' >> /var/lib/postgresql/data/postgresql.conf"

#Conexiones simultaneas >> multiples replias
docker exec -it pg-master bash -c "echo 'max_wal_senders = 4' >> /var/lib/postgresql/data/postgresql.conf"

#Max espacio para archivos WAL
docker exec -it pg-master bash -c "echo 'wal_keep_size = 512MB' >> /var/lib/postgresql/data/postgresql.conf"
docker exec -it pg-master bash -c "echo 'hot_standby = on' >> /var/lib/postgresql/data/postgresql.conf"

docker exec -it pg-master bash -c "echo 'host    replication     all     0.0.0.0/0       md5' >> /var/lib/postgresql/data/pg_hba.conf"

docker restart pg-master

#Configurar read replica
docker exec -it pg-replica bash -c "rm -rf /var/lib/postgresql/backup_data"

#Backup base del master para iniciar y sincronizar la replica
docker exec -it pg-replica pg_basebackup -h pg-master -U postgres -D /var/lib/postgresql/backup_data -P --password

#Asignar permiso al directorio backup_data y data al usuario postgres
docker exec -it pg-replica chown -R postgres:postgres /var/lib/postgresql/backup_data
docker exec -it pg-replica bash -c "rm -rf /var/lib/postgresql/data/* && cp -R /var/lib/postgresql/backup_data/* /var/lib/postgresql/data/"
docker exec -it pg-replica chown -R postgres:postgres /var/lib/postgresql/data

#Indicar a postgres para iniciar en modo standby(solo lectura) y comenzar a seguir al db master
docker exec -it pg-replica touch /var/lib/postgresql/data/standby.signal

#promote_trigger_file establecer read replica como master en caso de failover, tan solo creando el archivo
docker exec -it pg-replica bash -c "echo \"primary_conninfo = 'host=pg-master port=5432 user=postgres password=postgres'\" >> /var/lib/postgresql/data/postgresql.conf"
docker exec -it pg-replica bash -c "echo \"promote_trigger_file = '/tmp/promote_to_master'\" >> /var/lib/postgresql/data/postgresql.conf"

docker restart pg-replica