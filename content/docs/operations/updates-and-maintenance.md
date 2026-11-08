---
title: Updates and maintenance window
description: How engine patch updates are found and installed.
---

## How updates work

- Databasify checks daily for newer engine images within each database's version line. You can also choose **Check for updates** on the **Settings** tab or in the **Actions** menu.
- When an update is available, the **Version** setting shows it. It may be a new patch release or a rebuilt image of the same version.
- Updates install automatically in the database's weekly maintenance window, for databases that are ready.
- Each node restarts on the new image in turn, standbys first. Clients may reconnect once when the primary moves.

You can also install an available update right away from **Settings → Version** or **Actions**.

## Maintenance window

Each database has a weekly one-hour maintenance window, set by day and hour in UTC. The default is Sunday at 03:00 UTC. Change it under **Settings → Maintenance window**. The page also shows when the next window starts in your local time.

The maintenance window has no opt-out.

## Certificates

Databasify renews TLS certificates on its own. A daily check at 02:00 UTC renews certificates that expire within 30 days or no longer cover every hostname.

## Updating Databasify itself

Engine updates are separate from updates to the Databasify app. See [Updating and uninstalling](/getting-started/updating-and-uninstalling/).
