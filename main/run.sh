#echo 'DATABASE_URL="postgres://postgres:sD7IglOj8fwQacT3@db.rbakrhawjgkpcctivmmx.supabase.co:5432/postgres"' > .env

npm install

#npm run prisma:migrate

npm run prisma:deploy

node prisma/seed.js

npm run start:dev



