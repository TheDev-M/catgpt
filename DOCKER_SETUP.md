# CatGPT - Docker Setup 🐱

Full-stack virtual cat companion with Spring Boot, React, and PostgreSQL.

## Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd catgpt
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` and set:

```env
# Required
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
VITE_HF_TOKEN=your_huggingface_token_here  # Get from https://huggingface.co/settings/tokens

# For Docker (use Nginx proxy)
VITE_API_BASE_URL=PROXY

# Optional: Customize database, cat stats, intervals, etc.
```

### 3. Start Application

```bash
docker compose up -d
```

Access at **http://localhost:3000**

## Services

| Service  | Port | Description     |
| -------- | ---- | --------------- |
| Frontend | 3000 | React + Nginx   |
| Backend  | 8080 | Spring Boot API |
| Database | 5432 | PostgreSQL 16   |

## Common Commands

```bash
# View logs
docker compose logs -f

# Stop
docker compose down

# Rebuild after changes
docker compose up -d --build

# Reset everything (removes data)
docker compose down -v
```

## Development

**Local dev** (without Docker): Set `VITE_API_BASE_URL=http://localhost:8080` in `.env`

**Docker**: Set `VITE_API_BASE_URL=PROXY` to use Nginx proxy (no CORS issues)

## Troubleshooting

**Port conflicts**: Change ports in `docker-compose.yml`

**Backend not starting**: Check logs with `docker compose logs backend`

**CORS errors**: Ensure `VITE_API_BASE_URL=PROXY` and rebuild frontend

## Architecture

```
Browser → Nginx (3000) → Spring Boot (8080) → PostgreSQL (5432)
```

Nginx proxies `/api/*` requests to backend, avoiding CORS.
