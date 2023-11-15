# Transaction Microservice

## How to run

### Prerequisites

- docker
- docker-compose
- [Bun 1.0.11](https://bun.sh/)
- WSL2 (If using windows)

### Run 🕊️

1. Install dependencies

```bash
cd transaction-microservice
bun install
```

2. Create .env and customize it

```bash
cp .env.example .env
```

3. Run migrations

```bash
bunx prisma migrate deploy
```

4. Run seeds

```bash
bunx prisma db seed
```

5. Start service

```bash
bun start
```

This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
