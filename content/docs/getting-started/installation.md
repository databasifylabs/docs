---
title: Installation
description: Install Databasify on a Linux server.
---

Run this on a Linux server with at least 1 GB of memory (2 GB recommended):

```bash
curl -fsSL https://get.databasify.io/install.sh | sudo bash
```

The script:

1. installs Docker if it is missing,
2. downloads the release files to `/opt/databasify`,
3. asks for a domain (leave it empty to use the server's IP) and writes `/opt/databasify/.env`,
4. pulls the images, starts Databasify and waits until it is healthy.

When it finishes, it prints the address to open.

## Domain and HTTPS

- **With a domain:** Databasify serves HTTPS and Caddy requests a Let's Encrypt certificate once the domain points to the server. The installer warns you if the domain does not resolve to this server yet.
- **Behind Cloudflare's proxy:** answer yes when the installer asks whether the domain is proxied by Cloudflare. Caddy then uses an internal certificate, and you set Cloudflare's SSL/TLS mode to **Full**.
- **Without a domain:** Databasify serves plain HTTP on the IP address and the port you choose (80 by default).

You can also answer the questions ahead of time with environment variables: `DATABASIFY_DOMAIN`, `DATABASIFY_CLOUDFLARE_PROXY`, `DATABASIFY_HTTP_PORT` and `DATABASIFY_HTTPS_PORT`.

If `/opt/databasify/.env` already exists, the installer keeps it.

## Create the owner account

Open the address the installer printed. The first visit asks you to create the owner account with your name, email address and password. There is no public sign-up after that.

## Email

Email is needed for [alerts](/operations/monitoring-and-alerts/) and password resets. By default, mail is only written to the log. To send real email, set the `MAIL_*` settings in `/opt/databasify/.env` (`MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`), then recreate the containers:

```bash
cd /opt/databasify && sudo docker compose up -d --force-recreate
```

## Next step

[Create your first database](/getting-started/first-database/).
