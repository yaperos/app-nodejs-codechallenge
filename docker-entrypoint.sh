#!/bin/sh
npm run migration:run

npm run database:seed

node dist/apps/ms-transaction/main
