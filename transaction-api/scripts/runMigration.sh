#!/bin/bash

npx sequelize-cli db:migrate --config sequelize-config.json --migrations-path migrations
