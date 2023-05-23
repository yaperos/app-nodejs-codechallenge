# docker compose up -d

export KAFKA_BROKERS=localhost:9092
export POSTGRES_STRING=postgres://postgres:postgres@localhost:5432/postgres
export PROXY_HOST=localhost

# Run the application with the defined environment variables:
pnpm start