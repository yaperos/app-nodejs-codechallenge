#!/bin/sh

echo "Running common services with docker compose 🤖"
docker compose --env-file ./compose.env up -d
