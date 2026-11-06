---
title: Failover and recovery
description: Automatic failover, manual failover and recovering from an outage.
---

## Automatic failover

Each engine fails over with its own tooling, so failover keeps working while the Databasify app is down. Automatic failover needs a majority:

- PostgreSQL, MySQL, MariaDB and MongoDB: a primary and 2 standbys.
- Valkey and Redis: 3 voting nodes, counting standbys and read-only nodes.

With fewer nodes, the database page shows a hint to add one more.

## Manual failover

**Actions → Fail over** (or **Settings → Failover**) moves the primary role to a standby. Writes pause for a few seconds while the standby is promoted.

## Recover

**Actions → Recover** is for a database that has lost quorum, for example a primary and one standby after the primary went down. The most up-to-date reachable node becomes primary and the others rejoin it.

- Recovery is refused while a majority of members still answers. Use failover then.
- When Databasify reaches only a minority of members, you must confirm **The unreachable members are down**. If they are still running but cut off from Databasify, recovering creates a second primary.

## Durability

- MySQL and MariaDB certify every write across the group before it commits, so an acknowledged write survives the loss of the primary.
- PostgreSQL replicates asynchronously. A failover after a total outage or during a partition can lose the last writes. Patroni only promotes members within 1 MiB of lag.
- MongoDB writes with `w: majority` by default, and majority writes survive elections.
- Valkey and Redis replicate asynchronously, so a failover can lose writes that had not reached the promoted replica.

## DNS after failover

With a [custom domain](/dns/custom-domains/), the primary hostname moves to the new primary within about a minute plus the record TTL (60 seconds). Without one, clients must switch to the new primary's IP themselves.

## Stopping a running operation

While an operation runs, the database header shows it with a **Stop** button. The step running now finishes, then nothing else runs.
