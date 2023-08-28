#!/bin/bash

# THIS SCRIPT IS TO BE USED LOCALLY ONLY

export PGPASSWORD='postgres' ;psql -h localhost -U postgres -d yape_transaction -c "INSERT INTO transfer_type (name) VALUES ('wire_transfer'), ('ach'), ('debit_card'), ('credit_card');"
