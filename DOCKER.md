# 🐳 Running the App with Docker

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Windows
docker-setup.bat

# Linux/Mac
./docker-setup.sh
```

### Option 2: Manual Setup
```bash
# 1. Build and start all services
docker-compose up -d --build

# 2. Wait for services to be ready (about 60 seconds)
# 3. Seed the database
docker exec yape-app npm run seed

# 4. Test the application
docker exec yape-app npm run test:api
```

## 🏗️ Docker Architecture

The application runs in a multi-container setup:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   yape-app      │    │   yape-kafka    │    │  yape-postgres  │
│   (NestJS)      │    │   (Message      │    │   (Database)    │
│   Port: 3000    │    │    Broker)      │    │   Port: 5432    │
│                 │    │   Port: 9092    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  yape-kafka-ui   │
                    │   (Monitoring)  │
                    │   Port: 8080     │
                    └─────────────────┘
```

## 📋 Available Services

| Service | Container Name | Port | Description |
|---------|----------------|------|-------------|
| **App** | `yape-app` | 3000 | NestJS application with GraphQL |
| **PostgreSQL** | `yape-postgres` | 5432 | Database |
| **Kafka** | `yape-kafka` | 9092 | Message broker |
| **Kafka UI** | `yape-kafka-ui` | 8080 | Kafka monitoring interface |
| **Zookeeper** | `yape-zookeeper` | 2181 | Kafka coordination |

## 🔧 Docker Commands

### Development Mode
```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f kafka

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Mode
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Build production images
docker-compose -f docker-compose.prod.yml build

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Application Management
```bash
# Execute commands in the app container
docker exec yape-app npm run test
docker exec yape-app npm run seed
docker exec yape-app npm run lint

# Access app container shell
docker exec -it yape-app sh

# Restart just the app service
docker-compose restart app

# Rebuild just the app service
docker-compose build app
docker-compose up -d app
```

## 🧪 Testing with Docker

### 1. API Testing
```bash
# Run automated API tests
docker exec yape-app npm run test:api

# Run unit tests
docker exec yape-app npm test

# Run tests with coverage
docker exec yape-app npm run test:coverage
```

### 2. Manual Testing
- **GraphQL Playground**: http://localhost:3000/graphql
- **Kafka UI**: http://localhost:8080

### 3. Database Testing
```bash
# Connect to PostgreSQL
docker exec -it yape-postgres psql -U postgres -d yape_challenge

# Run database queries
docker exec yape-postgres psql -U postgres -d yape_challenge -c "SELECT * FROM transactions;"
```

## 🔍 Monitoring & Debugging

### View Service Status
```bash
# Check running containers
docker ps

# Check service health
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f kafka
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 app
```

### Debug Container Issues
```bash
# Access app container
docker exec -it yape-app sh

# Check app processes
docker exec yape-app ps aux

# Check app environment
docker exec yape-app env

# Check network connectivity
docker exec yape-app ping postgres
docker exec yape-app ping kafka
```

## 🚀 Performance Optimization

### Resource Limits
Add to `docker-compose.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Volume Optimization
```yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules  # Exclude node_modules from host
      - /app/dist          # Exclude build artifacts
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker exec yape-postgres pg_isready
   
   # Check database logs
   docker-compose logs postgres
   ```

3. **Kafka Connection Issues**
   ```bash
   # Check Kafka status
   docker exec yape-kafka kafka-topics --bootstrap-server localhost:9092 --list
   
   # Check Kafka logs
   docker-compose logs kafka
   ```

4. **App Won't Start**
   ```bash
   # Check app logs
   docker-compose logs app
   
   # Rebuild app container
   docker-compose build app
   docker-compose up -d app
   ```

### Reset Everything
```bash
# Stop all services and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## 📊 Production Considerations

### Environment Variables
Create `.env.prod` for production:
```env
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=yape_challenge
KAFKA_BROKER=kafka:29092
```

### Security
- Use secrets management for passwords
- Enable SSL/TLS for production
- Use non-root user in containers
- Limit container resources

### Scaling
```bash
# Scale app instances
docker-compose up -d --scale app=3

# Use load balancer (nginx)
# Add nginx service to docker-compose.yml
```

## 🎯 Quick Commands Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Test API
docker exec yape-app npm run test:api

# Access GraphQL
open http://localhost:3000/graphql

# Access Kafka UI
open http://localhost:8080

# Seed database
docker exec yape-app npm run seed

# Run tests
docker exec yape-app npm test
```

The Docker setup provides a complete, isolated development environment that matches production conditions. All services are properly networked and configured to work together seamlessly.
