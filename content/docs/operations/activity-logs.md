---
title: Activity logs
description: A record of every change Databasify makes on your servers.
---

Every change Databasify makes on a server is logged with its live output: setup steps, deployments, failovers, upgrades, DNS syncs and more.

- The **Activity** tab of a database lists the entries for that database.
- The **Activity** tab of a server lists the entries for that server.

Open an entry to see the commands' output while it runs and after it finishes. Failed entries explain what went wrong. For a database whose setup failed, check its activity, then use **Retry setup** on the **Overview** tab, which clears what the failed setup left on the nodes and runs it again.

Activity entries are kept for 30 days.
