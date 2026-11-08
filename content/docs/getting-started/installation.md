---
title: Installation
description: Install Databasify on a Linux server.
---

Run this on a [supported Linux server](/getting-started/requirements/) with at least 1 GB of memory (2 GB recommended):

```bash
curl -fsSL https://get.databasify.io/install.sh | sudo bash
```

The script:

1. checks the server: root access, a supported system, enough memory and a free port. If a check fails, it stops before changing anything,
2. asks for a domain (leave it empty to use the server's IP),
3. installs Docker if it is missing,
4. downloads the release files to `/opt/databasify` and writes `/opt/databasify/.env`,
5. pulls the images, starts Databasify and waits until it is healthy.

When it finishes, it prints the address to open. The full output of every step is in `/opt/databasify/install.log`. If a step fails, the installer shows the end of that log and the command to run it again.

## Domain and HTTPS

Databasify serves plain HTTP on port 80. HTTPS comes from Cloudflare's proxy:

1. In Cloudflare, add an `A` record for the domain that points to the server, with the proxy on (orange cloud).
2. Set Cloudflare's **SSL/TLS** mode to **Flexible**.
3. Enter the domain when the installer asks. It sets `APP_URL` to `https://<your-domain>`.

Visitors reach Databasify over HTTPS, and Cloudflare forwards the requests to the server over HTTP.

Without a domain, Databasify serves plain HTTP on the server's IP address.

You can answer the domain question ahead of time with the `DATABASIFY_DOMAIN` environment variable. Set it to an empty value to use the server's IP without being asked.

To use a port other than 80, change `HTTP_PORT` in `/opt/databasify/.env`, for example `HTTP_PORT=8080`, then recreate the containers.

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
