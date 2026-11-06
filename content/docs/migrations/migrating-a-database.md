---
title: Migrating an existing database
description: Copy an existing database once, or keep it in sync and cut over.
---

The **Migrations** tab moves data from any reachable server of the same engine into a Databasify database. The source is checked before anything is copied.

## Modes

- **Continuous migration:** copies the data, then keeps replicating changes until you cut over. Near-zero downtime.
- **One-time copy:** copies the data as it is now. Writes made to the source afterwards are not carried over.

| Engine         | Tools                                               |
| -------------- | --------------------------------------------------- |
| PostgreSQL     | `pg_dump` and `pg_restore`, logical replication     |
| MySQL          | MySQL Shell copy and a replication channel          |
| MariaDB        | `mariadb-dump` and a replication channel            |
| MongoDB        | MongoShake                                          |
| Valkey / Redis | redis-shake                                         |

## Start a migration

1. Allow the IPs shown on the tab on the source's firewall.
2. Enter the source host, port, username and password. Optionally list the databases to migrate; leave it empty to migrate every database.
3. Choose whether to connect to the source over TLS. The certificate is not verified, so private and self-signed certificates work.
4. Choose **Check source**. The report says whether the source is ready, can only be copied once, or needs changes first.
5. Pick a mode and choose **Start migration**.

## Source requirements for continuous migration

- **PostgreSQL:** `wal_level=logical`, and a user with `REPLICATION` (or superuser) that owns every table it publishes.
- **MySQL:** row-based binlogs, `gtid_mode=ON`, `REPLICATION SLAVE`, `REPLICATION CLIENT`, and `RELOAD` or `BACKUP_ADMIN`.
- **MariaDB:** row-based binlogs, `REPLICATION SLAVE`, `BINLOG MONITOR` and `RELOAD`.
- **MongoDB:** a replica set, and a user that can read the `local` database.

One-time copies need none of these. Any migration is refused when a target database already holds data (PostgreSQL, MySQL and MongoDB).

## Cut over

While a continuous migration syncs, the tab shows the replication lag.

1. Stop writes on the old database.
2. Wait for the lag to reach 0 seconds.
3. Choose **Finish migration**.

Replication from the source stops and the Databasify database becomes the source of truth. The migration is one-way: after cutover nothing is replicated back to the old database.

The target stays writable during a migration, but writes made there can conflict with changes replicated from the source.

## Stop a migration

**Stop migration** stops copying or syncing. Data already copied stays in the database. Turn on the force option to stop even if the source is unreachable. If the cleanup on the server fails, the migration shows **Clean up again**, which is safe to run.

The migrated databases are added to the [Users & Databases](/databases/users-and-schemas/) tab, and the default user gets access to them. Migration failures are sent as [email alerts](/operations/monitoring-and-alerts/).
