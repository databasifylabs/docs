---
title: Requirements
description: What you need to run Databasify and its databases.
---

## The Databasify server

Databasify itself runs on one Linux server with:

- at least 1 GB of memory
- root access (the installer runs with `sudo`)
- ports 80 and 443 free, or other ports you choose during installation

The installer installs Docker if it is missing.

## Database servers

Each database node runs on its own server. A server runs at most one node.

- **Operating system:** Ubuntu 24.04 or 26.04, Debian 12 or 13, Rocky Linux 9 or AlmaLinux 9. See [Supported operating systems](/servers/operating-systems/).
- **Access:** SSH from the Databasify server, as `root` or as a user with passwordless `sudo`.
- **Memory:** about 1 GB for the primary and standby servers of a database with standbys. A single-node database has no fixed minimum.
- **Network:** IPv4. Standby and read-only nodes must share a private network with the primary. Databasify can create an encrypted WireGuard network for you if your servers have none.

## Optional

- An S3-compatible bucket for [point-in-time recovery](/backups/storage-providers/).
- A Cloudflare account for [hostnames on your domain](/dns/custom-domains/).
- An SMTP server for [email alerts](/operations/monitoring-and-alerts/).
- An API token for DigitalOcean, Hetzner, Vultr or Linode to [order servers](/servers/server-providers/) from Databasify.
