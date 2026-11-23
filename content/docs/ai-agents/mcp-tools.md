---
title: MCP tools
description: Every tool the MCP server offers, by area.
---

Each tool needs the listed access in its area (see [Permissions](/ai-agents/mcp-server/#permissions)). Write access includes read. Ids are UUIDs; agents find them with the matching `list_` tool.

## System

| Tool | Access | What it does |
| --- | --- | --- |
| `get_system` | read | Get the Databasify version, whether an update is available, and the installed plugins. |

## Projects

| Tool | Access | What it does |
| --- | --- | --- |
| `create_project` | write | Create a project. Keys limited to some projects cannot create projects. |
| `delete_project` | write | Delete an empty project. Refused while it still holds servers, databases or providers, and for keys limited to some projects. |
| `list_projects` | read | List projects with how many servers, databases and providers each holds. Pages of 25; pass next_cursor for more. |
| `move_to_project` | write | Move a server, network, provider or database (with the servers behind its nodes) from one project to another. |
| `update_project` | write | Rename a project. |

## Server providers

| Tool | Access | What it does |
| --- | --- | --- |
| `create_server_provider` | write | Add a server provider (cloud account) to a project. The credentials are checked against the provider first. |
| `delete_network` | write | Delete an empty private network from Databasify, and optionally at the provider too. |
| `delete_server_provider` | write | Delete a server provider. Refused while servers or networks still use it. |
| `get_server_provider` | read | Get one server provider with its server and network counts. |
| `list_networks` | read | List the private networks Databasify manages, with their CIDR, region and server count. Pages of 25; pass next_cursor for more. |
| `list_provider_networks` | read | List the private networks a provider has in a region, read live from the provider's API. |
| `list_provider_plans` | read | List the server plans a provider offers in a region, read live from the provider's API. |
| `list_provider_regions` | read | List the regions a server provider offers, read live from the provider's API. |
| `list_server_provider_types` | read | List the server provider types this install supports, with the credential fields each needs. |
| `list_server_providers` | read | List server providers (cloud accounts) with their server and network counts. Credentials are never returned. Pages of 25; pass next_cursor for more. |
| `order_server` | write | Order a new server from a provider. It runs in the background: the server starts as 'creating'; poll get_server until it is ready. |
| `update_server_provider` | write | Rename a server provider or replace its credentials. Credentials left out stay as they are. |

## DNS providers

| Tool | Access | What it does |
| --- | --- | --- |
| `create_dns_provider` | write | Add a DNS provider to a project and import its zones. |
| `delete_dns_provider` | write | Delete a DNS provider. Refused while a database uses one of its domains. |
| `get_dns_provider` | read | Get one DNS provider with its zones. |
| `list_dns_provider_types` | read | List the DNS provider types this install supports, with the credential fields each needs. |
| `list_dns_providers` | read | List DNS providers with their zones and how many databases use each zone. Credentials are never returned. Pages of 25; pass next_cursor for more. |
| `refresh_dns_provider` | write | Import the zones of a DNS provider again, picking up zones added at the provider. |
| `update_dns_provider` | write | Rename a DNS provider or replace its credentials. Credentials left out stay as they are. |

## Storage providers

| Tool | Access | What it does |
| --- | --- | --- |
| `create_storage_provider` | write | Add an S3-compatible storage provider to a project. The bucket is checked with a test write first. |
| `delete_storage_provider` | write | Delete a storage provider. Refused while a database backs up to it. |
| `get_storage_provider` | read | Get one storage provider with the databases that back up to it. |
| `list_storage_providers` | read | List S3-compatible storage providers used for backups, with the databases that back up to each. Secret keys are never returned. Pages of 25; pass next_cursor for more. |
| `test_storage_provider` | write | Check a storage provider with a test write, read and delete, and mark it verified. |
| `update_storage_provider` | write | Change a storage provider. Leave secret_access_key out to keep the current secret. |

## Servers

| Tool | Access | What it does |
| --- | --- | --- |
| `create_server` | write | Add an existing server by SSH. Add Databasify's key from get_server_ssh_key first, or pass a root password once. Provisioning runs in the background: poll get_server until it is ready. |
| `create_server_user` | write | Create a Linux user on a server, optionally with an SSH public key. |
| `delete_server` | write | Remove a server from Databasify, and optionally destroy it at its provider. Refused while it is part of a database. |
| `delete_server_user` | write | Delete a Linux user that Databasify created on a server. |
| `get_server_log` | read | Get one server log with its full output. |
| `get_server_ssh_key` | read | Get Databasify's public SSH key, to add to a server's authorized_keys before adding the server. |
| `get_server` | read | Get one server with its status, hardware facts, private network and the database node it runs, if any. |
| `list_server_logs` | read | List the logs of commands Databasify ran on a server, newest first, without their output. Pages of 25; pass next_cursor for more. |
| `list_server_users` | read | List the Linux users Databasify created on a server. Pages of 25; pass next_cursor for more. |
| `list_servers` | read | List servers with their status, addresses, provider, size and operating system. Filter by search text or status. Pages of 25; pass next_cursor for more. |
| `provision_server` | write | Run the server setup again, for example after a failed setup. It runs in the background; poll get_server. |
| `refresh_server` | write | Read the operating system, CPUs, memory and disk of a server again over SSH. |
| `run_server_operation` | write | Run an operation on a ready server: update-packages or reboot. It runs in the background; poll get_server. |
| `update_server_network` | write | Change the private network of a server. |

## Databases

| Tool | Access | What it does |
| --- | --- | --- |
| `add_database_node` | write | Add a standby (member) or a read-only node on a ready server on the same private network. It runs in the background; poll get_database until the status settles. |
| `add_extension_package` | write | Add a custom extension package to a database from the official repository of its engine or another apt repository. Package code runs with full database rights. It runs in the background; poll get_database until the status settles. |
| `add_trusted_source` | write | Allow an IPv4 address or range to connect to the database or to one read-only node. A single address becomes a /32. It runs in the background; poll get_database until the status settles. |
| `cancel_migration` | write | Cancel a migration without cutting over. It runs in the background; poll get_database until the status settles. |
| `check_database_upgrade` | write | Look up a newer engine image for this database and record it as available_version. |
| `check_extension_package_version` | read | Show the installed and the newest available version of an official-repository or repository extension package of a database. |
| `check_migration` | write | Connect to a source database and report its version, size, databases and whether it can be replicated. |
| `check_recovery` | write | Check the backup archive and refresh the restorable window. It runs in the background; poll get_database until the status settles. |
| `create_connection_pool` | write | Create a connection pool for a schema, on the database or on one read-only node. It runs in the background; poll get_database until the status settles. |
| `create_database` | write | Create a database on one or more ready servers of a project: a primary and optional standbys on the same private network. It runs in the background; poll get_database until the status settles. |
| `create_database_user` | write | Create a database user. The response holds its generated password and connection details. |
| `create_schema` | write | Create a schema (logical database) inside a database. |
| `delete_connection_pool` | write | Delete a connection pool of the database or of one read-only node. It runs in the background; poll get_database until the status settles. |
| `delete_database_node` | write | Remove a node from a database. The last member cannot be removed. It runs in the background; poll get_database until the status settles. |
| `delete_database` | write | Delete a database and its containers. It runs in the background; poll get_database until the status settles. Data on the servers is kept unless erase_data is true. |
| `delete_database_user` | write | Delete a database user. The default user cannot be deleted. |
| `delete_schema` | write | Delete a schema and all its data. |
| `delete_trusted_source` | write | Remove an allowed IPv4 range from the database or from one read-only node. It runs in the background; poll get_database until the status settles. |
| `disable_database_extension` | write | Disable an extension in a schema. The engine refuses while anything still uses it. It runs in the background; poll get_database until the status settles. |
| `disable_recovery` | write | Turn off point-in-time recovery, optionally deleting the backups. It runs in the background; poll get_database until the status settles. |
| `enable_database_extension` | write | Enable an extension in a schema. Extensions that need a library restart the database node by node first. It runs in the background; poll get_database until the status settles. |
| `enable_recovery` | write | Turn on point-in-time recovery: continuous WAL or oplog archiving plus daily base backups to a storage provider of the same project. It runs in the background; poll get_database until the status settles. |
| `failover_database` | write | Promote a standby to primary. It runs in the background; poll get_database until the status settles. |
| `finish_migration` | write | Cut over a syncing migration: stop replication and make this database the one to use. It runs in the background; poll get_database until the status settles. |
| `get_database_log` | read | Get one database log with its full output. |
| `get_database_metrics` | read | Read the metric history (CPU, memory, disk, connections, replication lag) of a database or one of its nodes. |
| `get_database_node` | read | Get one node of a database. |
| `get_database` | read | Get one database with its status, health, nodes, hostnames, config, maintenance window and backup state. Passwords are never included. |
| `get_database_user_credentials` | write | Get the password and connection details of a database user. Needs write access because it reveals a secret. |
| `get_node_logs` | read | Read the latest lines of an engine service log on a node, such as postgres or patroni. |
| `get_recovery` | read | Get the point-in-time recovery settings and backup health of a database. |
| `list_connection_pools` | read | List the connection pools of a database, or of one read-only node. |
| `list_database_engines` | read | List the database engines this install supports, with their version lines, modes and limits. |
| `list_database_extensions` | read | List the extensions a database can enable, and the ones a schema has when a schema is given. |
| `list_database_logs` | read | List the logs of commands Databasify ran for a database, newest first, without their output. Pages of 25; pass next_cursor for more. |
| `list_database_nodes` | read | List the nodes of a database with their role, server, status and engine version. |
| `list_database_users` | read | List the users of a database. Passwords are not included; use get_database_user_credentials. |
| `list_databases` | read | List databases with their engine, version, status, health, nodes and hostnames. Filter by search text, status or engine. Pages of 25; pass next_cursor for more. |
| `list_extension_packages` | read | List the custom extension packages of a database, and the package change running now. |
| `list_migrations` | read | List the migrations into a database with their status and source. Source passwords are never returned. |
| `list_schemas` | read | List the schemas (logical databases) inside a database. |
| `list_trusted_sources` | read | List the IPv4 ranges allowed to connect to a database, or to one read-only node. |
| `reboot_database_node` | write | Restart a read-only node on its own. It runs in the background; poll get_database until the status settles. |
| `reboot_database` | write | Restart every node, standbys first. It runs in the background; poll get_database until the status settles. |
| `recover_database` | write | Recover a database whose primary is down, from the most advanced reachable member. It runs in the background; poll get_database until the status settles. |
| `refresh_database` | write | Read the live status and engine version of every node now. |
| `remove_extension_package` | write | Remove a custom extension package from every node of a database. Its extensions must be disabled first. It runs in the background; poll get_database until the status settles. |
| `reset_database_user_password` | write | Give a database user a new generated password and return it. |
| `restore_database` | write | Restore a database to a point in time as a new database on a ready server. The source database is untouched. It runs in the background; poll get_database until the status settles. |
| `retry_database_setup` | write | Run a failed database setup again. It runs in the background; poll get_database until the status settles. |
| `retune_database_node` | write | Recompute and apply the engine settings of a read-only node. It runs in the background; poll get_database until the status settles. |
| `retune_database` | write | Recompute and apply the engine settings for the current server sizes. It runs in the background; poll get_database until the status settles. |
| `run_backup` | write | Take a base backup now. It runs in the background; poll get_database until the status settles. |
| `start_migration` | write | Start copying a source database into this one, then keep it in sync until finish_migration. It runs in the background; poll get_database until the status settles. |
| `stop_database_operation` | write | Stop the operation running on a database and cancel its engine tasks. |
| `stop_node_operation` | write | Stop the operation running on a node and cancel its engine tasks. It runs in the background; poll get_database until the status settles. |
| `update_database_config` | write | Change the engine config of a database. Keys and allowed values come from the config_fields of get_database. It runs in the background; poll get_database until the status settles. |
| `update_database_domain` | write | Move a database to a DNS zone of a DNS provider, or back to Databasify's default domain with null. The nodes are redeployed. It runs in the background; poll get_database until the status settles. |
| `update_database_extension` | write | Update an extension in a schema to the version the image ships. Updates can't be undone. It runs in the background; poll get_database until the status settles. |
| `update_database_node` | write | Rename a read-only node. Its hostname changes too. |
| `update_extension_package` | write | Install the newest version of an official-repository or repository extension package on every node of a database. Its extensions stay enabled; update each schema afterwards with update_database_extension. It runs in the background; poll get_database until the status settles. |
| `update_maintenance_window` | write | Move the weekly maintenance window of a database (UTC day and hour). |
| `update_node_config` | write | Change the engine config of a read-only node. Keys come from the config_fields of get_database. It runs in the background; poll get_database until the status settles. |
| `update_persistence` | write | Turn disk snapshots on or off for a key-value engine. Engines that always persist refuse. It runs in the background; poll get_database until the status settles. |
| `update_recovery_schedule` | write | Change the backup retention and the hour of the daily base backup. It runs in the background; poll get_database until the status settles. |
| `update_user_password_encryption` | write | Change how the password of a database user is hashed. |
| `upgrade_database` | write | Upgrade the database to its available engine image, node by node. It runs in the background; poll get_database until the status settles. |
