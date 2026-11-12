---
title: Install with the Docker image
description: Run Databasify from its Docker image on any Docker host or container platform.
---

The [installer](/getting-started/installation/) is the easy path on a Linux server. Use the image directly when you run containers on a platform that takes an image and environment values, or on a Docker host you manage yourself.

## What you need

- The image `ghcr.io/databasifylabs/databasify:latest`, or a release tag such as `ghcr.io/databasifylabs/databasify:0.2.0`.
- A persistent volume mounted at `/app/storage`. It holds the SQLite database, the built-in Redis data and uploaded plugins.
- Port 80 exposed.
- Exactly **one** instance. Databasify treats any work still marked running when it starts as interrupted, so two instances would cancel each other's work.

The image runs everything in one container: the web app, the background workers (Horizon), the scheduler, Reverb for live updates, and Redis.

Optional:

- MySQL or PostgreSQL instead of SQLite, through the `DB_*` settings.
- An external Redis or Valkey through `REDIS_HOST`, `REDIS_PORT` and `REDIS_PASSWORD`. The built-in Redis then stays off. It only starts when `REDIS_HOST` is `127.0.0.1` or `localhost`.

## Settings

Set these environment values. The full template with every setting is at [get.databasify.io/env.example](https://get.databasify.io/env.example).

| Setting | Value |
|---|---|
| `APP_URL` | The address you open Databasify at, for example `https://databasify.example.com` |
| `APP_KEY` | `base64:` followed by 32 random bytes in base64 (see below). Keep it: without it, stored keys and passwords can't be read |
| `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET` | Random hex values (see below) |
| `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME` | `127.0.0.1`, `8080`, `http` |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | `127.0.0.1`, `6379`, `null` for the built-in Redis |
| `CACHE_STORE`, `SESSION_DRIVER`, `QUEUE_CONNECTION` | `redis` |
| `BROADCAST_CONNECTION` | `reverb` |
| `DB_*` | Only when you use MySQL or PostgreSQL instead of SQLite |
| `MAIL_*` | Optional, for [email alerts](/operations/monitoring-and-alerts/) and password resets |
| `HORIZON_*_MAX_PROCESSES` | Optional, the number of background workers per queue |

Generate the keys on any machine with OpenSSL:

```bash
echo "base64:$(openssl rand -base64 32)"   # APP_KEY
openssl rand -hex 4                        # REVERB_APP_ID
openssl rand -hex 16                       # REVERB_APP_KEY
openssl rand -hex 32                       # REVERB_APP_SECRET
```

## Run it

```bash
docker run -d --name databasify \
  --env-file databasify.env \
  -v databasify_storage:/app/storage \
  -p 80:80 \
  --restart unless-stopped \
  ghcr.io/databasifylabs/databasify:latest
```

On start, the container runs the database migrations, then starts serving. Open `APP_URL` and create the owner account.

## HTTPS

Databasify serves plain HTTP. Put it behind your platform's HTTPS proxy, or behind Cloudflare as described in [Installation](/getting-started/installation/#domain-and-https), and set `APP_URL` to the `https://` address.

## Updating

A container you run yourself has no **Updates** page, because the host service that runs updates comes with the install script. Pull the new tag and recreate the container with the same volume and settings. Background jobs that are still running when the old container stops are marked failed, and their database operations released, within about two hours, so check that nothing important is running before you update.
