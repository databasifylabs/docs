---
title: Adding a server
description: Add an existing Linux server over SSH.
---

Every database node runs on a server you add to Databasify. A server runs at most one database node. Servers belong to the current [project](/getting-started/projects/), and server names are unique across all projects. Go to **Servers → Add server** and choose **Existing server**, or choose **New server at a provider** to have Databasify order one (see [Server providers](/servers/server-providers/)).

## Existing server over SSH

1. **Connection:** enter the server's public IPv4 address, the SSH port (22 by default) and the SSH user (`root` by default). A user other than `root` needs passwordless `sudo`.
2. **First sign-in:** choose how Databasify signs in the first time.
   - **Password:** used once to install the Databasify SSH key, then forgotten.
   - **SSH key:** you add the Databasify public key yourself. The form shows the command to run on the server as the SSH user.
   After this, Databasify always uses its own key.
3. **Turn off SSH password login:** on by default and recommended. After setup, only SSH keys can sign in.
4. **Private network:** pick the network the server is on (see below).
5. Name the server and choose **Add server**.

Setup checks the operating system, updates packages, installs base tools and a pinned Docker version, and adds a 2 GB swap file when the server has less than 4 GB of memory and at least 6 GB of free disk. It takes 2 to 4 minutes. The server must run a [supported operating system](/servers/operating-systems/).

## Private network

Standby and read-only nodes must share the primary's private network. Choose one of:

- **An existing network**, such as a provider VPC Databasify already knows.
- **New network:** a private range you already have (for example `10.0.1.0/24`) and this server's private IP in it.
- **New Databasify network:** an encrypted WireGuard mesh that Databasify manages. It works across providers and takes an address block from `100.64.0.0/10`.
- **None:** the server can only run single-node databases.

You can change the network on the server page while the server is not part of a database.

Networks are listed under **Providers → Private networks**, where you can move them to another project. A network can only be removed once no server uses it.

## On the server page

- **Terminal:** a live root shell over SSH in the browser. It closes after 15 minutes without typing or when you leave the page.
- **Linux users:** add isolated users with their own home directory and no sudo access.
- **Actions:** refresh details, reboot, retry a failed setup, move it to another project, or remove the server. Removing makes Databasify forget the server; for a provider server you can also destroy it at the provider. A server that is part of a database can neither be removed nor moved on its own: remove its node from the database first, or move the whole database.
- **Activity:** every change Databasify made on the server, with its output. See [Activity logs](/operations/activity-logs/).
