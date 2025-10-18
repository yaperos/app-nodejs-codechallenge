#!/bin/sh
set -e

echo "Running database migrations..."
pnpm run prisma:migrate

echo "Seeding database..."
pnpm run prisma:seed || echo "Seed failed or already executed"

echo "Starting application..."
exec pnpm start
