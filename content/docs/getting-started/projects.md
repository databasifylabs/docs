---
title: Projects
description: Group servers, databases and providers, for example per environment.
---

A project groups servers, databases, networks, server providers, DNS providers and storage. Use projects to keep environments or clients apart, for example `production` and `staging`. Setup creates a project named `Default`.

Projects only organise resources. They do not limit who can see what.

## What belongs to a project

The **Project** group in the sidebar holds the pages of the current project: **Dashboard**, **Databases**, **Servers**, **Providers**, **DNS** and **Storage**. Their addresses start with the project's id, `/<project-id>/…`. The dashboard shows only the current project.

The **Global** group holds **Projects** and **Plugins**. Your settings and Horizon are global too.

## Switch projects

The project switcher at the top of the sidebar shows the current project. Open it to:

- search projects and pick one (the current one has a check mark),
- **Create project**,
- **Manage projects**, which opens the **Projects** page.

Switching keeps you in the same section: from **Servers** in one project you land on **Servers** in the other. Databasify opens the project you visited last.

## Manage projects

The **Projects** page lists every project with its number of servers, databases, networks and providers.

- **New project:** project names are unique.
- **Rename:** the project's addresses stay the same.
- **Delete:** only an empty project can be deleted. Move or delete its servers, databases, networks and providers first. The last project cannot be deleted.

## Providers per project

Server providers, DNS providers and storage belong to exactly one project. To use the same cloud, Cloudflare or S3 account in two projects, add it in each project. Provider names are unique within a project.

A database can only use servers, domains and storage from its own project.

Server, database and network names are unique across all projects, because database names become [hostnames](/dns/custom-domains/).

## Move to another project

**Move to project** appears once you have more than one project:

- **Databases:** **Actions → Move to project** on the database page. The database moves together with all its servers.
- **Servers:** **Actions → Move to project** on the server page. A server that is part of a database cannot move on its own; move the database instead.
- **Server providers and networks:** **Move** on the **Providers** page.
- **DNS providers:** **Move** on the **DNS** page. Its domains move with it, and databases that use them keep their hostnames.
- **Storage:** **Move** on the **Storage** page. Databases that archive to it keep archiving there.

A move changes only where a resource is listed. Moved servers keep using their provider and private network, even if those stay in the other project, and nothing changes on the servers or at the provider.

## What blocks a delete

Databasify refuses to delete something that another resource still depends on. Dependants in other projects count too:

- **A project** while it has servers, databases, networks or providers. The last project cannot be deleted at all.
- **A server provider** while Databasify still has servers or networks from it.
- **A network** while servers use it.
- **A DNS provider** while a database uses one of its domains.
- **Storage** while a database archives to it.
- **A server** while it is part of a database. Remove its node from the database first.
