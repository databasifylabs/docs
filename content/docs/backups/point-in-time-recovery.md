---
title: Backups and point-in-time recovery
description: Daily base backups, archived changes and restores into a new database.
---

Point-in-time recovery takes a daily base backup and archives every change from the current primary, so you can restore a new database to any second in the retention window.

It is available for PostgreSQL (pgBackRest), MySQL and MariaDB (xtrabackup or mariadb-backup plus binlog shipping) and MongoDB 7.0 and 8.0 (Percona Backup for MongoDB). It is not available for MongoDB 9.0, Valkey or Redis.

## Turn it on

1. [Add a storage provider](/backups/storage-providers/).
2. On the database's **Backups** tab, pick the storage, the number of days to keep restore points (1 to 35, 7 by default) and the hour of the daily base backup (UTC).
3. Choose **Turn on point-in-time recovery**.

Every node is redeployed one at a time to start archiving. A single-node database restarts once.

## On the Backups tab

- **Restorable window:** the earliest and latest moment you can restore to.
- **Last base backup** and the backup schedule. Changing the schedule applies without a restart.
- **Back up now:** starts a base backup.
- **Check now:** checks the archive.

Restores open up once the first base backup is in the archive.

## Restore

A restore always creates a new database. The original keeps running.

1. Pick a moment in the restorable window (in your local time).
2. Name the new database and pick a free server. The restore runs on one node; add standbys afterwards.
3. Choose **Restore into a new database**.

The new database gets the source's settings and its users and databases as they were at that moment. Users and databases created after the restore point are dropped, and each kept user gets the password it has in Databasify.

## Turn it off

**Turn off** stops archiving and redeploys every node one at a time. Backups stay in the bucket unless you choose **Also delete backups from the bucket**.
