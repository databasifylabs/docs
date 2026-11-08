---
title: Updating and uninstalling Databasify
description: Update the Databasify app or remove it from its server.
---

Databasify is installed in `/opt/databasify`. All its settings are in `/opt/databasify/.env`, including the app key and the Reverb credentials, and its data is in Docker volumes. A backup needs both the `.env` file and the `databasify_storage` volume: without the app key, the stored server keys and database passwords can't be read.

## Update

```bash
curl -fsSL https://get.databasify.io/update.sh | sudo bash
```

The update script downloads the latest release files, adds any new settings to `.env` without changing your existing ones, pulls the new images, restarts Databasify and waits until it is healthy. It then removes old Databasify images. The full output is in `/opt/databasify/update.log`.

The update also recomputes the background worker counts (`HORIZON_*_MAX_PROCESSES`) from the server's memory and CPUs. If they differ from the values in `.env`, it shows both and asks before changing them. Without a terminal it keeps your values; set `DATABASIFY_YES=true` to accept the new ones.

Databasify runs the `latest` image (`DATABASIFY_VERSION=latest` in `.env`). To stay on one release, change it to a release tag, for example `DATABASIFY_VERSION=0.2.0`.

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
