---
title: Managing plugins
description: Add DNS providers, server providers and database engines.
---

A plugin adds things Databasify does not ship with: **DNS providers**, **server providers** and **database engines**, plus anything a Laravel service provider can add, such as routes, views, migrations and console commands.

Plugins are global. Open **Plugins** under **Global** in the sidebar to manage them.

## Example plugins

Each example works as it is and is a GitHub template to start your own from:

| Repository | Adds |
| --- | --- |
| [`databasifylabs/example-dns-plugin`](https://github.com/databasifylabs/example-dns-plugin) | **Example DNS**, a fake DNS provider that keeps records in a JSON file, so you can try the flow offline |
| [`databasifylabs/example-server-plugin`](https://github.com/databasifylabs/example-server-plugin) | **Example Cloud**, a server provider that "orders" a server you already own |
| [`databasifylabs/example-database-plugin`](https://github.com/databasifylabs/example-database-plugin) | **Example Cache**, an engine that reuses Valkey's driver, image and scripts and overrides one step |

To write your own, see [Writing plugins](/plugins/writing-plugins/).

## Install

Choose **Install plugin**, then give one of:

- a GitHub repository, as `owner/repo` or its URL. Databasify takes its latest release, or its default branch when it has no release;
- an `https://` link to a zip;
- an uploaded zip, up to 50 MB.

A zip may hold the files at its root or inside one top folder, the way GitHub zips do. Databasify checks that the plugin supports this version, copies it, loads it once, runs its migrations and its install step, then restarts the queue workers. If any step fails, the install is undone.

## Enable and disable

Use the switch beside the plugin. The queue workers restart to pick up the change. A disabled plugin's providers and engines are hidden, and accounts that use them show as **not installed** until you enable it again.

## Update

Choose **Update** beside the plugin. Databasify downloads the latest version from where it was installed, or takes a new zip for an uploaded plugin. The new version must have the same package name and support this version of Databasify. Its files are replaced and new migrations run. Accounts and settings stay.

## Uninstall

Uninstalling runs the plugin's uninstall step, rolls back its migrations and deletes its files. Remove anything that still uses the plugin's providers or engines first.

## Errors

If a plugin fails to load, Databasify skips it and shows the error beside it on this page. Anything it registered is rolled back, so the rest of the app keeps working. A plugin that stops supporting the running version after an upgrade is skipped the same way.

## Security

A plugin is PHP code that runs with Databasify's full access: your servers, your database credentials and every provider token. Plugins are not signed. Install only plugins you trust.
