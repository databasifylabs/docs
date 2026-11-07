---
title: First database
description: Add a server and create your first database.
---

Everything you add lives in the current project, shown at the top of the sidebar. Setup creates a project named `Default`. See [Projects](/getting-started/projects/).

## 1. Add a server

Go to **Servers** and choose **Add server**. Pick an existing server over SSH, or a new server at a connected provider. See [Adding a server](/servers/adding-a-server/).

Setup installs Docker and takes 2 to 4 minutes. Wait until the server is ready.

To run standbys, add more servers on the same private network as the first one.

## 2. Create the database

Go to **Databases** and choose **Create database**.

1. **Choose a database engine** and its version. See [Engines and versions](/databases/engines/).
2. **Choose nodes:** pick a ready server as the primary. Optionally pick up to two standbys on the same private network. Each standby server needs about 1 GB of memory.
3. **Name the database.** Names are unique, 3 to 43 characters, lowercase letters, numbers and dashes, starting with a letter. They cannot start with `private-` or `replica-`.
4. Choose **Create database**.

The form shows what kind of failover you get:

- **Primary only:** no failover. If the primary goes down, so does the database.
- **Primary and one standby:** manual failover. Use **Recover** when the primary goes down.
- **Primary and two standbys:** automatic failover.

You can start with a single node and add standby and read-only nodes later. See [Nodes](/databases/nodes/).

## 3. Connect

When the database is ready, its **Overview** tab shows the connection details: host, port, user, password and a connection string. The default user is `databasify`. See [Connecting](/databases/connecting/).

Next, consider:

- restricting access to [trusted sources](/databases/connecting/#trusted-sources),
- adding a [custom domain](/dns/custom-domains/) so the hostname follows the primary,
- turning on [point-in-time recovery](/backups/point-in-time-recovery/).
