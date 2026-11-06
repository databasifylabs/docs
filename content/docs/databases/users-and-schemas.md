---
title: Users and schemas
description: Manage database users and databases.
---

For PostgreSQL, MySQL, MariaDB and MongoDB, the **Users & Databases** tab manages users and databases. Changes apply on every node.

## Users

- **Add user:** enter a name (a letter, then letters, digits or underscores, up to 32 characters). The user gets a generated password and full access to the databases you create.
- **Reset password:** sets a new generated password. Apps using the old one lose access until you update them.
- **Delete user:** connections using that user are refused from then on.
- The default user `databasify` cannot be deleted.

### MySQL password encryption

MySQL users use `caching_sha2_password` by default. If your client does not support it, change the user to **Legacy** (`mysql_native_password`) where the version offers it.

## Databases

- **Add database:** enter a name (a letter, then letters, digits or underscores, up to 64 characters). Databases live on every node and replicate automatically.
- **Delete database:** every table and row in it is dropped on all nodes. This cannot be undone.
- The default database `defaultdb` cannot be deleted.

## Valkey and Redis

Valkey and Redis have an **Access** tab instead. They use one password for the `default` user, with full access. Every connection must use TLS.
