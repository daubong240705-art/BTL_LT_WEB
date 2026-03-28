# BTL_LT_WEB

## Production Deploy

1. Create your production env file from the sample:

```powershell
Copy-Item .env.prod.example .env.prod
```

2. Edit `.env.prod` and replace at least:
- `SERVER_NAME`
- `SPRING_DATASOURCE_*`
- `MOVIEAPP_JWT_SECRET`
- `CLOUDINARY_*`
- `MOVIEAPP_FRONTEND_URL`

3. Start the production stack:

```powershell
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

4. Check the containers:

```powershell
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f
```

Notes:
- Production compose only exposes Nginx on port `80`; backend and frontend stay internal.
- If you terminate TLS on the host or another reverse proxy, keep `HTTP_PORT` internal and point your proxy to this stack.
- `UPLOADS_DIR` should point to persistent storage that is included in backups.
