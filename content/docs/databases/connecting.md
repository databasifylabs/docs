---
title: Connecting
description: Connection details, TLS, the default user and trusted sources.
---

The database's **Overview** tab shows the **Connection details**: connection parameters, a connection string, environment variables for your app and a command-line example. You can switch between:

- the **public network** and the **VPC network** (private addresses),
- the **primary node** and **standby nodes**, to route read traffic to standbys.

## Default user and database

Every PostgreSQL, MySQL, MariaDB and MongoDB database has a default user `databasify` with a generated password and a default database `defaultdb`. Neither can be deleted. Valkey and Redis use the `default` user and one password.

## TLS

Every engine serves TLS on its client port (25060, or 25061 for Valkey, Redis and PostgreSQL pools). Each database has its own private certificate authority.

You do not need the CA certificate to connect. The connection details use these settings:

| Engine         | Without the CA                                   |
| -------------- | ------------------------------------------------ |
| PostgreSQL     | `sslmode=require`                                |
| MySQL          | `--ssl-mode=REQUIRED`                            |
| MariaDB        | `--ssl`                                          |
| MongoDB        | `tls=true`, `tlsAllowInvalidCertificates=true`, `authSource=admin` |
| Valkey / Redis | `--tls --insecure`                               |

To verify the server, download the CA certificate from the connection details and use it, for example `sslmode=verify-full` with `sslrootcert` for PostgreSQL. The connection details show the exact option for each engine.

When a Valkey or Redis database has a [domain](/dns/custom-domains/), it serves a public Let's Encrypt wildcard certificate, and clients verify it without extra flags.

MySQL and MariaDB also accept unencrypted client connections.

## Hostnames

Without a domain, clients connect to the primary's IP. After a failover the primary moves to another node, and apps keep using the old address until you change it. Add a [custom domain](/dns/custom-domains/) so the hostname always follows the primary. With a domain, MongoDB clients can use `mongodb+srv://`.

## Trusted sources

By default any IP address can try to connect. A password and TLS are still required.

On the **Network Access** tab, add IPv4 addresses or CIDR ranges (for example `203.0.113.10` or `10.0.0.0/16`) with an optional label. Once at least one source exists, only those sources, the database's own nodes and their private network can connect. Overlapping ranges are merged automatically.
