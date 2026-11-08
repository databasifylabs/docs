---
title: Requirements
description: What you need to run Databasify and its databases.
---

## The Databasify server

Databasify itself runs on one Linux server with:

- at least 1 GB of memory, 2 GB recommended
- root access (the installer runs with `sudo`)
- port 80 free, or another port you set with `HTTP_PORT`

The installer installs Docker if it is missing.

Databasify sizes its background workers from the server's memory and CPUs when it starts. On 1 GB it runs one worker per queue and may use swap when busy. To set the numbers yourself, add `HORIZON_*_MAX_PROCESSES` values to `/opt/databasify/.env`, then run `docker compose up -d` in `/opt/databasify`.

## Database servers

Each database node runs on its own server. A server runs at most one node.

- **Operating system:** Ubuntu 24.04 or 26.04, Debian 12 or 13, Rocky Linux 9 or AlmaLinux 9. See [Supported operating systems](/servers/operating-systems/).
- **Access:** SSH from the Databasify server, as `root` or as a user with passwordless `sudo`.
- **Memory:** at least 1 GB is recommended for every node, especially for databases with standbys. Databasify does not enforce a minimum.
- **Network:** IPv4. Standby and read-only nodes must share a private network with the primary. Databasify can create an encrypted WireGuard network for you if your servers have none.

## Optional

- An S3-compatible bucket for [point-in-time recovery](/backups/storage-providers/).
- A Cloudflare account for [hostnames on your domain](/dns/custom-domains/).
- An SMTP server for [email alerts](/operations/monitoring-and-alerts/).
- An API token for DigitalOcean, Hetzner, Vultr or Linode to [order servers](/servers/server-providers/) from Databasify.
