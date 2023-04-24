FROM postgres:15.1-alpine

LABEL author="Carlos Lazaro"
LABEL description="Postgres Image for yape"
LABEL version="1.0"

COPY ./docker/query/*.sql /docker-entrypoint-initdb.d/