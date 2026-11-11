---
title: Engine SDK support
description: Which engine SDK versions each Databasify release runs.
---

Every database engine, the six built-in ones and every community engine, is built on the public [engine SDK](https://github.com/databasifylabs/engine-sdk), the Go module `github.com/databasifylabs/engine-sdk`. Each engine image records the exact SDK version it was built on in its `io.databasify.sdk` label.

## Supported versions

Each Databasify release runs one SDK range, written like a Composer constraint. It also installs one official host binary, `ghcr.io/databasifylabs/databasify-host`, on every database server.

| Databasify | SDK range | Host binary |
| --- | --- | --- |
| Next release | `^0.1` | `0.1.0` |

Before SDK `1.0`, any minor release may change the contract, so a Databasify release runs a single `0.x` minor. From `1.0`, minor releases only add commands and fields, and a range such as `^1.0 || ^2.0` covers an overlap between majors.

## What Databasify checks

- When it creates a database, adds a node or looks for the weekly update, Databasify reads the image's labels from the registry. It refuses an image outside its range before anything is pulled, for example: "Example Cache 9.0.3 is built on SDK 0.2.0; this Databasify supports ^0.1."
- After deploying a node, it asks the engine which SDK it runs and fails the deploy when it is outside the range.
- In the weekly maintenance window, a newer image outside the range is skipped. The database stays on its current image and you get a warning.

## Databases on a dropped SDK

When a Databasify upgrade moves past an SDK, a database whose image is built on the old SDK becomes **read-only** until its engine's author publishes a supported image:

- It keeps running. Status, metrics, logs, backups, restores, failover, outage recovery, reboots and delete still work.
- Changes are refused: settings, nodes, users and databases, connection pools, network rules, domains and backup settings. The database page shows a banner naming the engine's author, and the dashboard lists every read-only database.
- The weekly maintenance window moves it to the newest supported image of its line as soon as one exists, and the block lifts.

Before you upgrade Databasify, list the databases the new range would make read-only:

```bash
php artisan databases:check-sdks --range="^0.2"
```

## For engine authors

Rebuild your images on a supported SDK when it moves: update `engine-sdk` in `go.mod` and the `sdk` pin in `versions.json`, then push. The [engine template](https://github.com/databasifylabs/engine-template) walks through the whole release.
