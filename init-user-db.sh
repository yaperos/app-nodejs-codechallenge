#!/bin/bash
set -e

# Function to check if a user exists
user_exists() {
  psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$1'" | grep -q 1
}

# Function to check if a database exists
db_exists() {
  psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$1"
}

# Check if the user userapp exists
if user_exists "userapp"; then
  echo "User userapp already exists"
else
  echo "Creating user userapp"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER userapp WITH PASSWORD 'yape$';
    ALTER USER userapp WITH SUPERUSER;
EOSQL
fi

# Check if the database yape exists
if db_exists "yape"; then
  echo "Database yape already exists"
else
  echo "Creating database yape"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE yape;
    GRANT ALL PRIVILEGES ON DATABASE yape TO userapp;
    GRANT ALL ON SCHEMA public TO userapp;
EOSQL
fi
