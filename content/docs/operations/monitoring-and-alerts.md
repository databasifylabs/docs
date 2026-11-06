---
title: Monitoring, metrics and alerts
description: Node status, metrics, logs and email alerts.
---

Every minute Databasify reads the status and metrics of each node over SSH. There is no agent or exporter to install.

## Insights

The **Insights** tab charts, per node:

- CPU usage
- Memory usage
- Disk usage
- Load average (1 minute)
- Connections
- Operations per second

Pick a period of 1 hour, 6 hours, 24 hours or 7 days. Metrics have one-minute resolution and are kept for 7 days.

## Logs

The **Logs** tab shows the engine logs of a node. Pick the node, the service and the number of lines (100 to 2000), filter lines, follow new lines and download them.

## Email alerts

Alerts are sent by email to the owner account when:

- a database becomes degraded, offline or failed, and when it is healthy again,
- CPU, memory or disk usage on a node stays at or above 90% for 5 consecutive minutes, and when it drops back,
- a migration fails.

Thresholds are fixed and cannot be changed per database. Alerts need working email: set the `MAIL_*` settings described in [Installation](/getting-started/installation/#email).

Monitoring and alerts stop while the Databasify app is down. Failover does not.
