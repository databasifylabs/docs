---
title: Custom domains
description: Hostnames on your own domain that follow the primary.
---

With a DNS account connected, Databasify creates hostnames for every database under `db.<your-domain>` and keeps them pointing at the right nodes. Cloudflare is the supported DNS provider. [Plugins](/plugins/managing-plugins/) can add others.

## Connect Cloudflare

1. In Cloudflare, open **My Profile → API Tokens** and create a token with these permissions for the domains you want to use: `Zone → Zone → Read` and `Zone → DNS → Edit`.
2. In Databasify, open the [project](/getting-started/projects/) and go to **DNS → Add DNS account**, pick Cloudflare and paste the token. It is checked before saving and stored encrypted.
3. Name the account and choose **Check and add**. Its domains are imported. Use **Refresh domains** after you give the token access to more zones.

A DNS account belongs to one project, and its domains can only be picked by databases in that project. To use the same Cloudflare account in another project, add it there too.

## Give a database a domain

On the database's **Settings** tab, choose **Pick a domain** under **Domain**, pick one and choose **Save domain**. Databasify checks that the hostnames are free, then redeploys the nodes one at a time so their certificates cover the new names. The operation shows as **Serve on** followed by the primary's hostname.

For a database named `app-db` on `example.com`, Databasify publishes:

| Hostname                                | Points to                       |
| --------------------------------------- | ------------------------------- |
| `app-db.db.example.com`                 | the primary                     |
| `private-app-db.db.example.com`         | the primary's private address   |
| `replica-app-db.db.example.com`         | the standbys                    |
| `private-replica-app-db.db.example.com` | the standbys' private addresses |
| `<node-name>.db.example.com`            | a read-only node                |
| `private-<node-name>.db.example.com`    | that node's private address     |

For MongoDB, Databasify also publishes an SRV record (`_mongodb._tcp.app-db.db.example.com`), a TXT record with the replica set and auth source, and one address per member (`app-db-node-<position>.db.example.com`), so clients can connect with `mongodb+srv://app-db.db.example.com` and follow failovers themselves.

## How records are kept up to date

- Records are checked every minute and follow the primary after a failover. They only move when exactly one node claims to be primary.
- Records have a 60-second TTL. After a failover, clients may reach the old address for about a minute plus the TTL plus their own resolver cache.
- Records are DNS-only. Keep Cloudflare's proxy off for them.
- Hostnames are checked to be free before they are claimed.
- A failed sync shows up as a failed **Sync DNS records** entry in the database's activity and is retried on every refresh.

## Certificates with a domain

Each node's certificate covers its hostnames. What clients verify against depends on the engine:

- **Valkey and Redis** get a public Let's Encrypt wildcard certificate for `*.db.<your-domain>`, issued for the domain over a DNS challenge. Clients verify it against the system's CA store, with no CA file and no `--insecure`. The connection details switch to the public certificate once every node serves it. Until then, or if issuing fails, the nodes keep the database's own CA, and the daily certificate check tries again.
- **PostgreSQL, MySQL, MariaDB and MongoDB** keep the database's own CA. To verify the server, download the CA certificate from the connection details. See [Connecting](/databases/connecting/).

## Removing a domain

On the **Settings** tab, choose **Change** under **Domain**, pick **None, use IP addresses** or another domain, and save. The operation shows as **Stop using a domain**. Databasify removes every record of the old domain, including the MongoDB SRV and TXT records, then redeploys the nodes so their certificates drop the old names. If the records cannot be removed, the database keeps its domain and the change fails with Cloudflare's error. Deleting a database also removes its records.

Without a domain, clients connect by IP address and have to follow a failover themselves.

## Moving and removing an account

**Move** on the **DNS** page moves an account and its domains to another project. Databases that use them keep their hostnames.

A DNS account cannot be removed while a database in any project uses one of its domains. Pick another domain for that database first. Removing it makes Databasify forget the token; nothing changes in your DNS.
