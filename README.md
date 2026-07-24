# GitHub Profile Viewer

App que muestra la información de un perfil público de GitHub.

- **Backend (NestJS):** endpoint `GET /api/user/:username` que consulta la API pública de GitHub y devuelve el perfil ya normalizado (nombre, bio, repos públicos, seguidores, etc.).
- **Frontend (Next.js):** UI con estética de GitHub que al cargar consume el endpoint del backend y pinta el perfil.

Stack: NestJS 10 + TypeScript en el back (usa `fetch` nativo), y Next.js 15 (App Router) con React 19 y Tailwind en el front.

## Estructura

```
.
├── backend/    # API NestJS
└── frontend/   # UI Next.js
```

## Requisitos

- [Bun](https://bun.sh) (o npm) y Node.js 20+

## Correr en local

### 1. Backend

```bash
cd backend
cp .env.example .env
bun install
bun run start:dev
# API en http://localhost:3001/api
```

Probar el endpoint:

```bash
curl http://localhost:3001/api/user/pierox-afk
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
bun install
bun run dev
# UI en http://localhost:3000
```

## Variables de entorno

En `backend/.env`:

- `PORT` — puerto del backend (por defecto `3001`).
- `CORS_ORIGIN` — origen del frontend permitido, separados por coma si hay varios.
- `GITHUB_TOKEN` — opcional. Sin token GitHub limita a 60 req/h; con token sube a 5000.

En `frontend/.env.local`:

- `NEXT_PUBLIC_API_URL` — URL base del backend, incluyendo `/api`.
- `NEXT_PUBLIC_DEFAULT_USERNAME` — usuario que se carga al abrir la página.

## Tests

```bash
cd backend
bun run test
```

## Endpoint

`GET /api/user/:username`

**200 OK**

```json
{
  "login": "pierox-afk",
  "name": "Piero Sansossio",
  "avatarUrl": "https://avatars.githubusercontent.com/u/...",
  "htmlUrl": "https://github.com/pierox-afk",
  "bio": "...",
  "company": null,
  "blog": null,
  "location": "Argentina",
  "email": "...",
  "twitterUsername": null,
  "publicRepos": 9,
  "publicGists": 0,
  "followers": 3,
  "following": 0,
  "createdAt": "2025-06-16T...",
  "updatedAt": "..."
}
```

- `404` si el usuario no existe.
- `403/429` si se supera el rate limit de la API de GitHub.

## Despliegue

### Backend (Render / Railway / Fly.io)

- **Root directory:** `backend`
- **Build command:** `bun install && bun run build` (o `npm install && npm run build`)
- **Start command:** `node dist/main.js`
- **Env vars:** `CORS_ORIGIN` = URL del frontend desplegado, `GITHUB_TOKEN` (opcional)
- La plataforma inyecta `PORT` automáticamente; el backend lo respeta.

### Frontend (Vercel)

- **Root directory:** `frontend`
- **Framework preset:** Next.js (autodetectado)
- **Env vars:** `NEXT_PUBLIC_API_URL` = URL del backend desplegado + `/api`, `NEXT_PUBLIC_DEFAULT_USERNAME` = `pierox-afk`

## Enlaces del despliegue

- **Repositorio (público):** _pendiente_
- **Frontend en producción:** _pendiente_
- **Backend en producción:** _pendiente_
