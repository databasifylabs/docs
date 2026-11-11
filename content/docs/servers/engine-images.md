---
title: Engine images on a server
description: How a database node's Docker image and the databasify command get onto a server.
---

Each database node runs in one Docker container on its server, from a Databasify engine image. You don't install anything by hand: Databasify does it over SSH whenever it deploys a node.

## The images

Engine images are published as `ghcr.io/databasifylabs/databasify-<engine>`, tagged with the engine release, for example `databasify-postgres:18.6`. Each image holds the engine and `databasify`, the command that configures and operates it.

When you create a database, Databasify picks the newest release in the [version line](/databases/engines/#version-lines-and-updates) you chose and stores its digest. Every node of that database pulls the image by that digest, so all nodes run byte-identical images even if the tag moves later. The digest only changes when an [update](/operations/updates-and-maintenance/) is installed.

## Deploying a node

A new node, a redeploy and an image update all go through the same steps:

1. **Install the `databasify` command on the server.** The first time, Databasify copies it out of the engine image to `/usr/local/bin/databasify`. If the server already has it, this step does nothing.
2. **`databasify host deploy`** runs on the server, outside any container. It:
   - pulls the image by digest when the server doesn't have it yet;
   - refuses to go on when the server's data belongs to another database, before changing anything;
   - creates `/srv/<engine>` for the node's data, configuration and certificates;
   - creates or starts the `databasify-<engine>` container, or replaces it when the image changed;
   - removes older images of the same engine;
   - refreshes the `databasify` command on the server, waits until the engine answers, and tunes the server for the engine.
3. **`databasify host wrapper-update`** runs when the container was created or replaced. It installs the `databasify` build the app follows, from the `ghcr.io/databasifylabs/databasify-wrapper` image, inside the container, then configures the node again. The `databasify` inside an engine image can be older, so this step makes every new container run the same build. See [Engine fixes without a restart](/operations/updates-and-maintenance/#engine-fixes-without-a-restart).
4. The node's TLS certificate is installed.

## The container

The container is named `databasify-<engine>`, uses the host network, and restarts on its own unless stopped. Its data lives in `/srv/<engine>` on the server, so replacing the container keeps the data. A server holds one node per engine.

A server's data can only be reused by the database that wrote it. To reuse a server for another database, delete the first database with **Erase data**. See [Settings](/databases/settings/).
