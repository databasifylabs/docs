---
title: Custom domains
description: Hostnames on your own domain that follow the primary.
---

With a DNS account connected, Databasify creates hostnames for every database under `db.<your-domain>` and keeps them pointing at the right nodes. Cloudflare is the supported DNS provider. Plugins can add others.

## Connect Cloudflare

1. In Cloudflare, open **My Profile → API Tokens** and create a token with these permissions for the domains you want to use: `Zone → Zone → Read` and `Zone → DNS → Edit`.
2. In Databasify, open the [project](/getting-started/projects/) and go to **DNS → Add DNS account**, pick Cloudflare and paste the token. It is checked before saving and stored encrypted.
3. Name the account and choose **Check and add**. Its domains are imported. Use **Refresh domains** after you give the token access to more zones.

A DNS account belongs to one project, and its domains can only be picked by databases in that project. To use the same Cloudflare account in another project, add it there too.

## Give a database a domain

On the database's **Settings** tab, choose **Pick a domain** under **Domain** and save. For a database named `app-db` on `example.com`, Databasify publishes:

| Hostname                               | Points to                         |
| -------------------------------------- | --------------------------------- |
| `app-db.db.example.com`                | the primary                       |
| `private-app-db.db.example.com`        | the primary's private address     |
| `replica-app-db.db.example.com`        | the standbys                      |
| `private-replica-app-db.db.example.com`| the standbys' private addresses   |
| `<node-name>.db.example.com`           | each read-only node               |

For MongoDB, Databasify also publishes an SRV and a TXT record so clients can connect with `mongodb+srv://`.

## How records are kept up to date

- Records are checked every minute and follow the primary after a failover. They only move when exactly one node claims to be primary.
- Records have a 60-second TTL. After a failover, clients may reach the old address for about a minute plus the TTL plus their own resolver cache.
- Records are DNS-only. Keep Cloudflare's proxy off for them.
- Each node's certificate covers its hostnames. Valkey and Redis databases with a domain get a public Let's Encrypt wildcard certificate for `*.db.<your-domain>`, so clients can verify the server without the CA.
- Hostnames are checked to be free before they are claimed, and records are removed when the database is deleted.
- A failed sync shows up as a failed **Sync DNS records** entry in the database's activity and is retried on every refresh.

## Moving and removing an account

**Move** on the **DNS** page moves an account and its domains to another project. Databases that use them keep their hostnames.

A DNS account cannot be removed while a database in any project uses one of its domains. Pick another domain for that database first. Removing it makes Databasify forget the token; nothing changes in your DNS.
