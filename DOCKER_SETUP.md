# CatGPT - Docker Setup Guide 🐱

A full-stack application featuring a virtual cat companion powered by AI, built with Spring Boot, React, and PostgreSQL.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0 or higher)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd catgpt
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env
```

Edit `.env` and update the following **required** values:

```env
# Generate a secure JWT secret (minimum 256 bits)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_minimum_256_bits

# Get your HuggingFace token from https://huggingface.co/settings/tokens
VITE_HF_TOKEN=your_huggingface_token_here
```

**Optional:** You can also customize:

- Database credentials (POSTGRES_USER, POSTGRES_PASSWORD)
- Cat behavior settings (hunger intervals, running intervals, etc.)
- JWT expiration time

### 3. Start the Application

```bash
docker compose up -d
```

This will:

- Start a PostgreSQL database
- Build and start the Spring Boot backend
- Build and start the React frontend with Nginx

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Database:** localhost:5432

## Services

| Service  | Container Name  | Port | Description               |
| -------- | --------------- | ---- | ------------------------- |
| Frontend | catgpt-frontend | 3000 | React app served by Nginx |
| Backend  | catgpt-backend  | 8080 | Spring Boot REST API      |
| Database | catgpt-postgres | 5432 | PostgreSQL 16             |

## Docker Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Stop the Application

```bash
docker compose down
```

### Stop and Remove All Data

```bash
docker compose down -v
```

### Rebuild After Code Changes

```bash
# Rebuild and restart all services
docker compose up -d --build

# Rebuild specific service
docker compose up -d --build backend
```

### Check Service Status

```bash
docker compose ps
```

## Development

### Making Changes

1. **Backend changes:** Modify files in `./backend/src`, then rebuild:

   ```bash
   docker compose up -d --build backend
   ```

2. **Frontend changes:** Modify files in `./frontend/src`, then rebuild:

   ```bash
   docker compose up -d --build frontend
   ```

3. **Environment changes:** Update `.env` file and restart:
   ```bash
   docker compose down
   docker compose up -d
   ```

### Accessing Container Shell

```bash
# Backend
docker exec -it catgpt-backend sh

# Frontend
docker exec -it catgpt-frontend sh

# Database
docker exec -it catgpt-postgres psql -U catgpt -d catgpt
```

## Troubleshooting

### Backend won't start

1. Check if PostgreSQL is healthy:

   ```bash
   docker compose ps postgres
   ```

2. View backend logs:

   ```bash
   docker compose logs backend
   ```

3. Ensure JWT_SECRET is set in `.env`

### Frontend can't connect to backend

1. Check if backend is running:

   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. Verify `VITE_API_BASE_URL` in `.env` matches your setup

### Database connection issues

1. Reset the database:

   ```bash
   docker compose down -v
   docker compose up -d
   ```

2. Check PostgreSQL logs:
   ```bash
   docker compose logs postgres
   ```

### Port conflicts

If ports 3000, 8080, or 5432 are already in use, you can change them in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:80" # Changed from 3000:80
```

## Environment Variables Reference

### Database

- `POSTGRES_USER` - Database username (default: catgpt)
- `POSTGRES_PASSWORD` - Database password (default: catgpt123)

### Backend (JWT)

- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED)
- `JWT_EXPIRATION` - Token expiration in milliseconds (default: 3600000)

### Backend (Cat Stats)

- `MAX_HUNGER` - Maximum hunger level (default: 10)
- `MAX_MOOD` - Maximum mood level (default: 10)
- `MAX_HEALTH` - Maximum health level (default: 10)

### Frontend (API)

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080)
- `VITE_HF_TOKEN` - HuggingFace API token (REQUIRED)

### Frontend (Cat Behavior)

- `VITE_RUN_DURATION_MS` - How long cat runs (default: 4000)
- `VITE_RUN_MIN_INTERVAL_MS` - Minimum time between runs (default: 120000)
- `VITE_RUN_MAX_INTERVAL_MS` - Maximum time between runs (default: 300000)
- `VITE_FALL_DURATION_MS` - How long items fall (default: 5000)
- `VITE_FALL_MIN_INTERVAL_MS` - Minimum time between falling items (default: 10000)
- `VITE_FALL_MAX_INTERVAL_MS` - Maximum time between falling items (default: 20000)
- `VITE_HUNGER_INTERVAL_MS` - How often hunger decreases (default: 60000)

## Architecture

```
┌─────────────────┐
│   React + Vite  │  Port 3000
│   (Nginx)       │
└────────┬────────┘
         │
         │ /api → proxy
         │
┌────────▼────────┐
│  Spring Boot    │  Port 8080
│  (Java 21)      │
└────────┬────────┘
         │
         │ JDBC
         │
┌────────▼────────┐
│   PostgreSQL    │  Port 5432
│   (16-alpine)   │
└─────────────────┘
```

## Production Considerations

Before deploying to production:

1. **Change default credentials** in `.env`
2. **Use a strong JWT_SECRET** (generate with `openssl rand -base64 64`)
3. **Set up HTTPS** with a reverse proxy (nginx, Caddy, Traefik)
4. **Use Docker secrets** instead of `.env` file
5. **Set up proper logging** and monitoring
6. **Configure database backups**
7. **Review and harden security settings**
8.

## Support

For issues and questions, please open an issue on GitHub.
