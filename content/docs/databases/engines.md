---
title: Engines and versions
description: The database engines and version lines Databasify runs.
---

| Engine     | Version lines                           | High availability                  | Client port |
| ---------- | --------------------------------------- | ---------------------------------- | ----------- |
| PostgreSQL | 15, 16, 17, 18                          | Patroni and etcd                   | 25060       |
| MySQL      | 8.4 LTS, 9.7 LTS                        | InnoDB Cluster (Group Replication) | 25060       |
| MariaDB    | 10.11 LTS, 11.4 LTS, 11.8 LTS, 12.3 LTS | Galera, single writer              | 25060       |
| MongoDB    | 7.0, 8.0, 9.0                           | Replica set                        | 25060       |
| Valkey     | 7, 8, 9                                 | Sentinel                           | 25061       |
| Redis      | 7.2, 8                                  | Sentinel                           | 25061       |

PostgreSQL [connection pools](/databases/connection-pools/) listen on port 25061.

You pick the engine and version line when you [create a database](/getting-started/first-database/). The form preselects PostgreSQL 18, MySQL 8.4, MariaDB 11.8, MongoDB 8.0, Valkey 9 and Redis 8.

## Version lines and updates

A database stays on the line it was created on. Each line only takes updates that keep the data format and the license the same, so no update needs an upgrade step:

- **PostgreSQL** lines are majors and take every new minor release of that major, which in PostgreSQL are patch releases.
- **MySQL, MariaDB, MongoDB and Redis 7.2** lines are exact release cycles and take patch releases only. For example, MariaDB 11.4 moves from 11.4.12 to 11.4.13, never to 11.5.
- **Valkey and Redis 8** lines are majors and take the newest release of that major, including new minor releases. For example, Valkey 8 can move from 8.0 to 8.1.

Updates install in the database's [maintenance window](/operations/updates-and-maintenance/).

A database never moves to another line on its own, and moving it is not offered. To run a newer line, create a new database on that line and [migrate](/migrations/migrating-a-database/) the data into it.

Redis 7.4 is not offered: it is not open source and uses a newer data format than 7.2. Redis 8 is offered under the AGPLv3.

Older lines may lack features of newer ones. Databasify then hides those features for databases on the older line.

## Differences between engines

- **Point-in-time recovery** is available for PostgreSQL, MySQL, MariaDB and MongoDB 7.0 and 8.0. It is not available for MongoDB 9.0, Valkey or Redis. See [Backups](/backups/point-in-time-recovery/).
- **Users and databases** can be managed for PostgreSQL, MySQL, MariaDB and MongoDB. Valkey and Redis use one password for the `default` user. See [Users and schemas](/databases/users-and-schemas/).
- **Connection pools** are PostgreSQL only.
- **Persistence** can be turned off for Valkey and Redis. See [Settings](/databases/settings/#persistence).
- **Durability on failover:** MySQL Group Replication and MariaDB Galera certify each write across the group before it commits. PostgreSQL, Valkey and Redis replicate asynchronously, so a failover can lose the last writes. MongoDB uses a `majority` write concern by default.

Each node runs in its own Docker container from an engine image pinned by digest.
