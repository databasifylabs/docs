---
title: Connection pools
description: PgBouncer connection pools for PostgreSQL.
---

A connection pool lets many app connections share a few PostgreSQL connections, through PgBouncer on every node. Pools are available for PostgreSQL only, on the **Connection Pools** tab.

## Add a pool

- **Pool name:** lowercase letters, digits and underscores, starting with a letter, up to 63 characters. `postgres` and `pgbouncer` are reserved. Clients use the pool name as the database name.
- **Database:** the database the pool connects to.
- **Mode:**
  - **Transaction:** a server connection per transaction. Best for most web apps.
  - **Session:** a server connection for the whole client session.
  - **Statement:** a server connection per statement. No multi-statement transactions.
- **Size:** 1 to 500 server connections.

## Connect

Pools listen on port 25061 over TLS. Clients connect with their own database user and password:

```text
postgresql://<user>:<password>@<host>:25061/<pool-name>?sslmode=require
```
