# Setup and Development Reference

## 🚀 Local Project Setup (First Time)

### **Prerequisites**

- Node.js 18+ installed
- Docker and Docker Compose installed
- pnpm installed (`npm install -g pnpm`)

### **Step-by-Step Setup**

```bash
# 1. Clone and navigate to project
cd app-nodejs-codechallenge

# 2. Install dependencies
pnpm install

# 3. Start Docker services (PostgreSQL, Kafka, Zookeeper)
docker-compose up -d

# 4. Verify services are running
docker-compose ps
# Should show: postgres, kafka, zookeeper, kafka-ui (all "Up")

# 5. Configure environment variables
cp .env.example .env  # If .env.example exists
# Or ensure .env has:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
# KAFKA_BROKER="localhost:9092"
# KAFKA_CONSUMER_GROUP_ID="app-consumer-group"

# 6. Generate Prisma Client
pnpm prisma:generate

# 7. Run database migrations
pnpm prisma:migrate
# When prompted for migration name, enter: init

# 8. Start the application
pnpm start:dev

# 9. Verify application is running
# - GraphQL Playground: http://localhost:3000/graphql
# - Kafka UI: http://localhost:8080
# - Prisma Studio: pnpm prisma:studio (http://localhost:5555)
```

### **Verify Setup**

```bash
# Check Docker services
docker-compose ps

# Check database connection
pnpm prisma:validate

# Check application health
curl http://localhost:3000/health-check

# View Kafka topics
# Open http://localhost:8080 in browser
```

### **Troubleshooting Setup**

**Problem: "Can't reach database server"**

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

**Problem: "Prisma Client not found"**

```bash
pnpm prisma:generate
```

**Problem: "Port 5432 already in use"**

```bash
# Stop local PostgreSQL or change port in docker-compose.yml
sudo service postgresql stop
# or
lsof -ti:5432 | xargs kill
```

**Problem: "Kafka connection failed"**

```bash
# Restart Kafka and Zookeeper
docker-compose restart kafka zookeeper

# Wait 30 seconds for Kafka to be ready
sleep 30
```

## Quick Start

```bash
# 1. Generate Prisma Client after schema changes
pnpm prisma:generate

# 2. Create and apply migration
pnpm prisma:migrate

# 3. Open Prisma Studio (Database GUI)
pnpm prisma:studio
```

## Development Commands

### **Generate Prisma Client**

```bash
pnpm prisma:generate
```

- Generates TypeScript types from `schema.prisma`
- Run after any schema changes
- Output: `generated/prisma` directory

### **Create Migration**

```bash
pnpm prisma:migrate
# or with custom name
pnpm exec prisma migrate dev --name add-idempotency-key
```

- Creates a new migration file
- Applies migration to database
- Automatically runs `prisma generate`
- Use for: Adding/modifying tables, columns, indexes

### **Apply Migrations (Production)**

```bash
pnpm prisma:migrate:deploy
```

- Applies pending migrations without prompts
- Use in CI/CD pipelines
- Does NOT generate Prisma Client (run separately)

### **Reset Database**

```bash
pnpm prisma:migrate:reset
```

⚠️ **WARNING**: Drops all data!

- Drops database
- Applies all migrations from scratch
- Use for: Clean slate in development

### **Prisma Studio (Database GUI)**

```bash
pnpm prisma:studio
```

- Opens visual database editor at http://localhost:5555
- View/edit data in browser
- No SQL required

### **Format Schema**

```bash
pnpm prisma:format
```

- Auto-formats `schema.prisma`
- Consistent indentation and spacing

### **Validate Schema**

```bash
pnpm prisma:validate
```

- Checks schema for errors
- Validates relations and types
- Run before committing

## Database Commands

### **Push Schema (Prototype Mode)**

```bash
pnpm db:push
```

- Syncs schema to database WITHOUT migrations
- Fast iteration during prototyping
- ⚠️ Can cause data loss
- Use for: Rapid prototyping only

### **Pull Schema from Database**

```bash
pnpm db:pull
```

- Introspects existing database
- Generates `schema.prisma` from database
- Use for: Adding Prisma to existing project

## Common Workflows

### **After Modifying Schema**

```bash
pnpm prisma:migrate      # Create and apply migration
pnpm prisma:generate     # Regenerate client (auto-run by migrate)
```

### **Setting Up New Environment**

```bash
pnpm install                      # Install dependencies
pnpm prisma:migrate:deploy        # Apply migrations
pnpm prisma:generate              # Generate client
```

### **Fresh Start (Development)**

```bash
pnpm prisma:migrate:reset    # Drop DB, apply migrations
```

### **Before Committing**

```bash
pnpm prisma:format           # Format schema
pnpm prisma:validate         # Validate schema
pnpm build                   # Ensure TypeScript compiles
```

## Migration Files

Located in: `prisma/migrations/`

### **Example Migration Structure**

```
prisma/migrations/
  ├── 20250107_init/
  │   └── migration.sql
  ├── 20250107_add_idempotency_key/
  │   └── migration.sql
  └── migration_lock.toml
```

### **Manual Migration Edits**

```bash
# 1. Create migration without applying
pnpm exec prisma migrate dev --create-only --name custom-migration

# 2. Edit SQL in prisma/migrations/xxx_custom-migration/migration.sql

# 3. Apply migration
pnpm exec prisma migrate dev
```

## Troubleshooting

### **"Prisma Client not found"**

```bash
pnpm prisma:generate
```

### **"Migration conflict"**

```bash
pnpm exec prisma migrate resolve --applied <migration-name>
# or
pnpm exec prisma migrate resolve --rolled-back <migration-name>
```

### **"Database out of sync"**

```bash
pnpm prisma:migrate:reset    # Development only!
# or
pnpm exec prisma migrate deploy       # Production
```

### **"Schema validation failed"**

```bash
pnpm prisma:validate
pnpm prisma:format
```

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

## Production Deployment

```bash
# 1. Build application
pnpm build

# 2. Apply migrations (CI/CD)
pnpm prisma:migrate:deploy

# 3. Generate client (if not in build step)
pnpm prisma:generate

# 4. Start application
pnpm start:prod
```

## Best Practices

✅ **DO:**

- Run `prisma:generate` after schema changes
- Use migrations for all schema changes
- Commit migration files to version control
- Format schema before committing
- Test migrations in staging first

❌ **DON'T:**

- Use `db:push` in production
- Edit migration SQL after applying
- Skip migrations (use `db:push` instead of `migrate`)
- Delete migration files manually
- Share database URLs in code

## Schema Examples

### **Adding a Field**

```prisma
model Transaction {
  id     String @id @default(cuid())
  amount Float  // New field
}
```

```bash
pnpm prisma:migrate -- --name add-amount-field
```

### **Adding an Index**

```prisma
model Transaction {
  id     String @id
  status String

  @@index([status])  // New index
}
```

```bash
pnpm prisma:migrate -- --name add-status-index
```

### **Adding a Relation**

```prisma
model User {
  id           String        @id @default(cuid())
  transactions Transaction[]
}

model Transaction {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

```bash
pnpm prisma:migrate -- --name add-user-relation
```

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
