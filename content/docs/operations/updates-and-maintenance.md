---
title: Updates and maintenance window
description: How engine updates and engine fixes are found and installed.
---

## How updates work

- Databasify checks daily for newer engine images within each database's [version line](/databases/engines/#version-lines-and-updates). You can also choose **Check for updates** on the **Settings** tab or in the **Actions** menu.
- When an update is available, the **Version** setting shows it. It may be a new patch release or a rebuilt image of the same version.
- Updates install automatically in the database's weekly maintenance window, for databases that are ready.
- Each node restarts on the new image in turn, standbys first. Clients may reconnect once when the primary moves.

You can also install an available update right away from **Settings → Version** or **Actions**.

## Engine fixes without a restart

Each node runs `databasify`, a small program inside the engine container that the app calls to configure and operate the engine. Fixes to it are published on their own, as the `ghcr.io/databasifylabs/databasify-wrapper` image, and reach running databases without a restart and without an image update.

- Each Databasify release follows one version of this program. When a fix is published under that version, the app notices within ten minutes, with no app update and no registry polling in between.
- A database picks up the fix at its next change, such as a setting, a trusted source, a domain or a new node. That change starts an **Install databasify** operation, which copies the new program into every node, read-only nodes and standbys first. Nodes keep running and there is no failover. While it runs, the change is refused with a message to try again in a few minutes.
- A database nobody changes keeps the version it has until its next change or image update.
- Deleting a database, retrying its setup, failover, recovery, image updates and removing a server never wait for the install.
- New nodes and image updates always get the current version.
- A few long-running helper processes inside a node keep the older version until the node next restarts.

Image updates, described above, are still how new engine patch releases reach a database.

## Maintenance window

Each database has a weekly one-hour maintenance window, set by day and hour in UTC. The default is Sunday at 03:00 UTC. Change it under **Settings → Maintenance window**. The page also shows when the next window starts in your local time.

The maintenance window has no opt-out.

## Certificates

Databasify renews TLS certificates on its own. A daily check at 02:00 UTC renews certificates that expire within 30 days or no longer cover every hostname.

## Updating Databasify itself

Engine updates are separate from updates to the Databasify app. See [Updating and uninstalling](/getting-started/updating-and-uninstalling/).
