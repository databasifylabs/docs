---
title: Server providers
description: Order new servers on DigitalOcean, Hetzner, Vultr or Linode.
---

Databasify can order new servers from a cloud account, or you can [add any server over SSH](/servers/adding-a-server/).

Supported providers:

| Provider      | Credential | Permissions                                                                                                                                                            |
| ------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DigitalOcean  | API token  | Full access, or custom scopes `account:read` `droplet:create` `droplet:read` `droplet:delete` `ssh_key:create` `ssh_key:read` `vpc:read` `regions:read` `sizes:read` `image:read` `tag:create` |
| Hetzner Cloud | API token  | Read & Write                                                                                                                                                           |
| Vultr         | API key    | Enable the API and allow the Databasify server's IPv4 (or all IPv4) under Access Control                                                                               |
| Linode        | API token  | `Linodes: Read/Write` and `VPCs: Read/Write`                                                                                                                           |

## Connect an account

1. Go to **Providers → Add provider** and pick the provider.
2. Paste the token. It is checked with the provider before saving, then stored encrypted.
3. Name the account and choose **Check and add**.

## Order a server

Go to **Servers → Add server → New server at a provider**, then pick the account, region, operating system, size and private network (an existing VPC, a new one the provider creates, a Databasify WireGuard network, or none).

The server logs in as `root` with the Databasify SSH key, and password login is turned off. Databasify waits up to 10 minutes for it to boot and up to 10 more for SSH, then runs the same setup as for any other server.

## Limits

- Providers are only used to order, find and delete servers. Firewalls, volumes, snapshots and resizing are not managed through the provider.
- Removing a provider account makes Databasify forget the token. Nothing changes in the account itself.
- Plugins can add more providers.
