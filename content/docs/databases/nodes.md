---
title: Nodes
description: Primary, standby and read-only nodes.
---

A database runs on one or more nodes, each on its own server. You can run a single node, just a primary, or grow it into a highly available cluster by adding standbys and read-only nodes at any time.

## Primary

The primary serves reads and writes. Every database has exactly one.

## Standby nodes

A standby keeps a full copy of the data and takes over if the primary fails.

- A database has at most 2 standbys.
- A standby's server must share the primary's private network. At least 1 GB of memory is recommended for every node.
- With a primary and 2 standbys, failover is automatic. With a primary and 1 standby, use **Recover** when the primary goes down. Valkey and Redis also count read-only nodes toward the 3 voting nodes Sentinel needs.

Clients can connect to standbys directly to spread read traffic. See [Connecting](/databases/connecting/).

## Read-only nodes

A read-only node has its own name and host, serves reads from its own copy on the same port, and is never promoted to primary.

- Read-only nodes do not count toward the standby limit. Each engine caps them at its own replica limit.
- When a healthy standby exists, a new read-only node copies its data from it to spare the primary (Valkey and Redis always replicate from the primary).
- Its name is used for its hostname when the database has a [domain](/dns/custom-domains/).

## Add a node

On the database's **Overview** tab, choose to add a standby or a read-only node, pick a free server on the same private network, and confirm. Read-only nodes also need a name.

## Remove a node

Open the node and choose **Remove** on its settings. The node leaves the database and its copy of the data is erased. Turn on **Force** to remove it even if its server cannot be reached.

## Reboot servers

**Actions → Reboot servers** reboots the database's servers one at a time: read-only nodes and standbys first, each must serve again before the next. Then the primary moves to a standby and its server reboots last, so clients may reconnect once.
