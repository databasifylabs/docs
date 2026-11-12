---
title: Updating and uninstalling Databasify
description: Update the Databasify app or remove it from its server.
---

Databasify is installed in `/opt/databasify`. All its settings are in `/opt/databasify/.env`, including the app key and the Reverb credentials, and its data is in Docker volumes. A backup needs both the `.env` file and the `databasify_storage` volume: without the app key, the stored server keys and database passwords can't be read.

## Update

### From the app

Open **Updates** in the sidebar. Databasify checks for a new release once a day; **Check now** checks right away. When a release is out, a badge shows on **Updates** and the page shows the release notes of the newest release, with a link to all releases on GitHub.

Choose **Update to** the new version and confirm. The page follows the update step by step. Databasify is offline for about a minute while it restarts, and the page reconnects on its own. The databases on your servers keep running the whole time. Any signed-in user can update.

If the new version does not become healthy, the update rolls back to the version that was running. The page then says which step failed and shows the update log, with **Try again**.

The **Updates** page exists only on servers set up with the install script, which installs the small host service that runs updates for the app. Servers installed with Databasify 0.1.0 get it the first time you update them over SSH.

### Over SSH

```bash
curl -fsSL https://get.databasify.io/update.sh | sudo bash
```

### What an update does

Both ways run the same update script. It downloads the latest release files, refreshes the host update service, adds any new settings to `.env` without changing your existing ones, pulls the new images, restarts Databasify and waits until it is healthy. If restarting fails or the new version is not healthy, it starts the previous image again. It then removes old Databasify images.

Background jobs get up to 30 minutes to finish before the old container stops. Only one update runs at a time. The log of the latest update is in `/opt/databasify/updater/update.log`.

The update also recomputes the background worker counts (`HORIZON_*_MAX_PROCESSES`) from the server's memory and CPUs. If they differ from the values in `.env`, it shows both and asks before changing them. Without a terminal, which includes updates started from the app, it keeps your values; set `DATABASIFY_YES=true` to accept the new ones.

Databasify runs the `latest` image (`DATABASIFY_VERSION=latest` in `.env`). To stay on one release, change it to a release tag, for example `DATABASIFY_VERSION=0.2.0`. A pinned server shows the pinned version on the **Updates** page and offers no update.

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
