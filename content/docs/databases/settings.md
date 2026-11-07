---
title: Settings
description: Version, maintenance window, persistence, domain and configuration.
---

The database's **Settings** tab holds:

- **Version:** the running version, whether an update is available, and **Check for updates**. See [Updates and maintenance](/operations/updates-and-maintenance/).
- **Maintenance window:** the weekly hour when patch updates install.
- **Persistence** (Valkey and Redis only).
- **Domain:** hostnames from one of the project's DNS domains. See [Custom domains](/dns/custom-domains/).
- **Failover:** move the primary to a standby. See [Failover and recovery](/databases/failover-and-recovery/).
- **Advanced configuration** of the engine.
- **Destroy database.**

## Persistence

Valkey and Redis keep an append-only file next to an RDB snapshot by default, so data is written to disk and survives restarts. A crash loses at most about one second of writes.

You can turn persistence off. Nodes then keep data in memory only: a node that restarts comes back empty and copies the data from the primary again, and if every node restarts at once the data is gone.

## Advanced configuration

Auto values are sized from the CPU and memory of each node. Changes apply to every node. Settings marked **Restart** restart the nodes one at a time.

When a server of the database was resized, a notice asks you to **Retune**. Retuning reads the CPU and memory of every node again and resizes the auto values. Nodes restart one at a time, standbys first. Values you set yourself are kept.

## Destroy a database

Services stop on every node and the database is removed from Databasify. Options:

- **Erase data:** deletes data, certificates and configuration from every server. Without it, data stays on each server's disk.
- **Also delete backups from the bucket** (with point-in-time recovery): removes every base backup and log of the database.
- **Force:** remove the database even if some servers cannot be reached.

You confirm by typing the database name.
