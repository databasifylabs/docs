---
title: MCP server
description: Let AI agents manage Databasify with only the access you approve.
---

Databasify has a built-in [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server. An AI agent such as Claude, ChatGPT, Cursor or VS Code connects to it and works with your projects, providers, servers and databases. It can do the same things as the [API](#api-keys), and only what you approve.

The MCP URL is your Databasify address followed by `/mcp`, for example `https://db.example.com/mcp`. It uses the Streamable HTTP transport.

## Connect an agent

Go to **Connected apps → Connect an agent**. Pick your agent to see its steps and the MCP URL to copy. The steps for each agent are also in [Agent setup](/ai-agents/agent-setup/).

Most agents sign in with your Databasify account:

1. Add the MCP URL to the agent.
2. The agent opens a browser window. Sign in to Databasify if you are not signed in, and confirm your password.
3. The **Connect** page shows the agent's name, its logo and the address it returns to after you approve. Check that address before you go on.
4. Pick what the agent may do (see [Permissions](#permissions)), then choose **Approve**. **Deny** sends the agent back without access.

The agent then appears on the **Connected apps** page.

Claude and ChatGPT connect from their own servers, so your Databasify must be reachable from the internet over HTTPS on port 443. Agents that run on your computer, such as Claude Code, Cursor and VS Code, also work with a private address.

## Permissions

On the **Connect** page you set a level for each area:

| Area | Covers |
| --- | --- |
| Projects | Projects and moving resources between them. |
| Server providers | Cloud accounts, ordering servers and private networks. |
| DNS providers | DNS providers and their zones. |
| Storage providers | Buckets for point-in-time recovery. |
| Servers | Servers, their users, logs and operations. |
| Databases | Databases, nodes, users, schemas, backups, migrations, pools and settings. |
| System | The Databasify version and plugins. Read only. |

- **None:** the agent cannot see or use that area.
- **Read:** the agent can list and view.
- **Write:** the agent can also create, change and delete. Write includes read.

An agent only sees the tools its levels allow. Database user passwords need **Databases: Write**, because they are secrets.

Under **Projects**, choose **All projects**, which includes projects you create later, or **Selected** and tick the projects it may use. An agent limited to some projects cannot create or delete projects, cannot move resources out of them, and gets "not found" for anything outside them.

## What an agent can do

An agent can do everything the API can, through one tool per action. See the [list of tools](/ai-agents/mcp-tools/). The agent sees the common read tools straight away and finds the rest with `search_tools`.

Operations such as creating a database, failover, reboot, upgrade or restore run in the background. The tool returns at once, and the agent checks the status with the matching `get_` tool.

These stay in the Databasify UI and are never available to agents:

- the server terminal;
- installing, updating and removing plugins;
- updating Databasify;
- your account, password, passkeys and two-factor settings.

## Connected apps

**Connected apps** lists every agent you approved, with its logo, the address it returns to, its level for each area, its projects, when it connected and when it was last used.

- An agent stays connected while it is in use. Its access token lasts an hour and renews itself. An agent that is not used for 30 days has to sign in again.
- Connecting the same agent again keeps its permissions and skips the **Connect** page.
- To change an agent's permissions, remove it and connect it again.
- **Remove** stops the agent at once: its tokens no longer work and it has to sign in again to come back.

## API keys

Agents that cannot sign in, or that you prefer to configure once, can use an API key instead. Create one under **API keys → Create API key**, with the same areas, levels and projects as above. The key is shown once. Then send it in the `Authorization` header:

```text
Authorization: Bearer YOUR_API_KEY
```

The **API key** option in each agent's steps shows where the header goes. ChatGPT only supports signing in.

## Limits

Each agent and each API key can make 120 requests a minute.
