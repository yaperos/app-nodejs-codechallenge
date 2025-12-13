FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Copia los archivos .sql a la carpeta de migraciones compilada
RUN mkdir -p dist/src/migrations && cp src/migrations/*.sql dist/src/migrations/
RUN npm test
EXPOSE 3002
# Ejecuta migraciones y luego inicia el servicio
CMD ["sh", "-c", "node dist/src/migrations/run-sql-migrations.js && npm run start:prod"]