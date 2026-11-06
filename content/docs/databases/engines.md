---
title: Engines and versions
description: The database engines and version lines Databasify runs.
---

| Engine     | Versions                    | High availability                  | Client port |
| ---------- | --------------------------- | ---------------------------------- | ----------- |
| PostgreSQL | 17, 18                      | Patroni and etcd                   | 25060       |
| MySQL      | 8.4 LTS, 9.7 LTS            | InnoDB Cluster (Group Replication) | 25060       |
| MariaDB    | 11.4 LTS, 11.8 LTS          | Galera, single writer              | 25060       |
| MongoDB    | 7.0, 8.0, 9.0               | Replica set                        | 25060       |
| Valkey     | 8, 9                        | Sentinel                           | 25061       |
| Redis      | 8                           | Sentinel                           | 25061       |

PostgreSQL [connection pools](/databases/connection-pools/) listen on port 25061.

You pick the engine and version line when you [create a database](/getting-started/first-database/). Patch releases within that line install automatically in the [maintenance window](/operations/updates-and-maintenance/). Moving to another version line is not offered.

## Differences between engines

- **Point-in-time recovery** is available for PostgreSQL, MySQL, MariaDB and MongoDB 7.0 and 8.0. It is not available for MongoDB 9.0, Valkey or Redis. See [Backups](/backups/point-in-time-recovery/).
- **Users and databases** can be managed for PostgreSQL, MySQL, MariaDB and MongoDB. Valkey and Redis use one password for the `default` user. See [Users and schemas](/databases/users-and-schemas/).
- **Connection pools** are PostgreSQL only.
- **Persistence** can be turned off for Valkey and Redis. See [Settings](/databases/settings/#persistence).
- **Durability on failover:** MySQL Group Replication and MariaDB Galera certify each write across the group before it commits. PostgreSQL, Valkey and Redis replicate asynchronously, so a failover can lose the last writes. MongoDB uses a `majority` write concern by default.

Each node runs in its own Docker container from an engine image pinned by digest.
