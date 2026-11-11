---
title: Engine images on a server
description: How a database node's Docker image and the databasify command get onto a server.
---

Each database node runs in one Docker container on its server, from a Databasify engine image. You don't install anything by hand: Databasify does it over SSH whenever it deploys a node.

## The images

Engine images are published as `ghcr.io/databasifylabs/databasify-<engine>`, tagged with the engine release, for example `databasify-postgres:18.6`. Each image holds the engine and `databasify`, the command that configures and operates it, built on the public [engine SDK](/plugins/engine-sdk/). Each engine lives in its own repository, such as [`databasifylabs/engine-postgres`](https://github.com/databasifylabs/engine-postgres).

When you create a database, Databasify picks the newest release in the [version line](/databases/engines/#version-lines-and-updates) you chose and stores its digest. Every node of that database pulls the image by that digest, so all nodes run byte-identical images even if the tag moves later. The digest only changes when an [update](/operations/updates-and-maintenance/) is installed.

## Deploying a node

A new node, a redeploy and an image update all go through the same steps:

1. **Install the host binary.** Each Databasify release pins one official host binary, `ghcr.io/databasifylabs/databasify-host:<version>`, and Databasify follows that tag's digest. Before every deploy it copies `/databasify` out of that image to `/usr/local/bin/databasify` on the server, and replaces the file only when the bytes differ. No code from an engine image is installed on the server, so nothing of a community engine stays behind once it is removed.
2. **`databasify host deploy`** runs on the server, outside any container. It:
   - refuses an image without an `io.databasify.sdk` label;
   - pulls the image by digest when the server doesn't have it yet;
   - refuses to go on when the server's data belongs to another database, before changing anything;
   - creates `/srv/<engine>` for the node's data, configuration and certificates;
   - creates or starts the `databasify-<engine>` container, or replaces it when the image changed;
   - removes older images of the same engine;
   - waits until the engine answers, and tunes the server with the host profile the engine reports.
3. **`databasify engine info`** asks the deployed engine which [engine SDK](/plugins/engine-sdk/) it was built on. The deploy fails when Databasify doesn't support that SDK.
4. The node's TLS certificate is installed.

Inside the container, the `databasify` that ships in the engine image is the one that runs. Fixes to it reach a database only as a new image, in its weekly maintenance window.

## The container

The container is named `databasify-<engine>`, uses the host network, and restarts on its own unless stopped. Its data lives in `/srv/<engine>` on the server, so replacing the container keeps the data. A server holds one node per engine.

A server's data can only be reused by the database that wrote it. To reuse a server for another database, delete the first database with **Erase data**. See [Settings](/databases/settings/).
