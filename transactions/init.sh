#!/bin/sh

npx prisma db push
npx prisma db seed
npm run start:dev

exec "$0"