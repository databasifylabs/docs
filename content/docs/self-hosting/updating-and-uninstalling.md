---
title: Updating and uninstalling Databasify
description: Update the Databasify app or remove it from its server.
---

Databasify is installed in `/opt/databasify`. Its settings are in `/opt/databasify/.env`, and its data is in Docker volumes.

## Update

```bash
curl -fsSL https://get.databasify.io/update.sh | sudo bash
```

The update script downloads the latest release files, adds any new settings to `.env` without changing your existing ones, pulls the new images, restarts Databasify and waits until it is healthy. It then removes old Databasify images.

Databasify runs the `latest` image. To stay on one release, add `DATABASIFY_VERSION` to `.env` with a release tag, for example `DATABASIFY_VERSION=0.2.0`.

The running version shows next to the Databasify logo in the sidebar and at the bottom of the sign-in page.

## Uninstall

```bash
curl -fsSL https://get.databasify.io/uninstall.sh | sudo bash
```

This stops Databasify. Its data stays in `/opt/databasify` and its Docker volumes, and the install script starts it again.

To remove Databasify and all its data (servers, the list of databases, keys), add `--purge`:

```bash
curl -fsSL https://get.databasify.io/uninstall.sh | sudo bash -s -- --purge
```

It asks for confirmation. Without a terminal, set `DATABASIFY_YES=true` to confirm.

In both cases the databases on your servers keep running. Databasify no longer manages them.
