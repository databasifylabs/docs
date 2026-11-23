---
title: Extensions
description: Enable PostgreSQL extensions per schema, and add your own extension packages.
---

PostgreSQL databases come with a curated set of extensions in the image, such as pgvector, PostGIS, pg_cron and TimescaleDB. Nothing is enabled until you ask for it. Manage them on the **Extensions** tab, through the REST API or with the [MCP tools](/ai-agents/mcp-tools/#databases).

## Enable an extension

1. Pick the schema on the **Extensions** tab.
2. Click **Enable extension**, then pick one from the list. The list is grouped, for example **Vectors and search** or **Geo**.

Extensions that load a library when PostgreSQL starts, such as pg_cron or TimescaleDB, restart the nodes one by one first, standbys before the primary. pg_cron lives in one schema per database.

Write users can also run `CREATE EXTENSION` themselves for every offered extension that needs no restart:

```sql
CREATE EXTENSION vector;
```

## Update and disable

- **Update** moves an extension to the version the image ships. Updates can't be undone.
- **Disable** drops the extension. It's refused while anything still uses it, such as a column of its type, and it never cascades. Remove what uses it first.

## Custom packages

Extensions the image doesn't ship can be added as packages, per database, under **Custom packages**. They're installed on every node, now and on every later deploy, and their extensions show up in the **Custom** group.

| Source | What you enter |
| --- | --- |
| **PGDG** | A package from apt.postgresql.org, such as `postgresql-18-http`. |
| **Apt repository** | The repository line, such as `deb https://example.com/debian trixie main`, its signing key (an https URL or the ASCII-armored key) and the package name. |
| **Upload** | Your own `.deb` files, up to 10 files, 200 MB each and 512 MB in total. |

The notice above the list says which system the packages must be built for, for example Debian 13 (trixie) with PostgreSQL 18 on amd64. Packages built for another release, PostgreSQL version or CPU type won't install. A database with custom packages keeps all its nodes on that one CPU type.

A package is refused when:

- It's built for another PostgreSQL version.
- It ships no extension, or only untrusted languages such as `plsh`.
- Its extension is already in the image or in another package.
- It would replace a package that's already installed.

**Check for a newer version** installs the newest build of a package on every node. Its extensions stay enabled; click **Update** on each schema afterwards. A package can only be removed after its extensions are disabled.

Before an engine upgrade, every custom package is tried on the new image first. The upgrade waits for that, and an alert says why when a package doesn't install on the new version.

**Only add packages you trust.** Package code runs with full database rights, and a crashing library stops PostgreSQL on every node.

## Build your own

To use an extension of your own, build a `.deb` package for the system shown in the notice, in your own CI. Then upload it, or publish it to your own apt repository and add it from there.
