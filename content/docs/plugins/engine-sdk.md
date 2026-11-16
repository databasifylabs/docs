---
title: Engine SDK support
description: Which engine SDK versions each Databasify release runs.
---

Every database engine image, for the six built-in engines and every community engine, runs `databasify`, the runtime from the public [engine SDK](https://github.com/databasifylabs/engine-sdk), as PID 1. It runs the scripts of the engine's driver and supervises its processes; engine authors copy it into their image and write no code against it. Each engine image records the exact SDK version it was built on in its `io.databasify.sdk` label.

## Supported versions

Each Databasify release requires one SDK range, written like a Composer constraint in its config:

```php
'require' => [
    'engine-sdk' => '^0.2.2 || ^1.0',
],
```

Engine images must be built on an SDK inside that range, and every database server gets the newest official host binary in it, `ghcr.io/databasifylabs/engine-sdk`.

| Databasify | Requires |
| --- | --- |
| 0.2 | `engine-sdk ^0.2.2 \|\| ^1.0` |

SDK `1.0` is the final runtime: later `1.x` releases only fix bugs, and every new engine feature is a script in its driver. `^0.2.2` stays in the range so databases on the images Databasify 0.1 deployed keep running until their weekly update.

## What Databasify checks

- When it creates a database, adds a node or looks for the weekly update, Databasify reads the image's labels from the registry. It refuses an image outside its range before anything is pulled, for example: "Example Engine 13.7 is built on SDK 2.0.0; this Databasify supports ^0.2.2 || ^1.0."
- After deploying a node, it asks the engine which SDK it runs and fails the deploy when it is outside the range.
- In the weekly maintenance window, a newer image outside the range is skipped. The database stays on its current image and you get a warning.

## Databases on a dropped SDK

When a Databasify upgrade moves past an SDK, a database whose image is built on the old SDK becomes **read-only** until its engine's author publishes a supported image:

- It keeps running. Status, metrics, logs, backups, restores, failover, outage recovery, reboots and delete still work.
- Changes are refused: settings, nodes, users and databases, connection pools, network rules, domains and backup settings. The database page shows a banner naming the engine's author, and the dashboard lists every read-only database.
- The weekly maintenance window moves it to the newest supported image of its line as soon as one exists, and the block lifts.

Before you upgrade Databasify, list the databases the new range would make read-only:

```bash
php artisan databases:check-sdks --range="^1.0"
```

## For engine authors

Build your images on SDK `1.0`: keep the template's `AS sdk` stage and the `sdk` pin in `versions.json` on the same release, then push. When a `1.x` bug-fix release comes out, move both pins to it and push again. The [engine template](https://github.com/databasifylabs/engine-template) walks through the whole release.
