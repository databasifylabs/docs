---
title: Agent setup
description: Connect Claude, ChatGPT, Cursor, VS Code and other MCP clients.
---

Replace `https://db.example.com/mcp` with your MCP URL, shown under **Connected apps → Connect an agent**. Each agent can sign in with your Databasify account, which opens the **Connect** page where you pick its permissions (see [MCP server](/ai-agents/mcp-server/)). Most can use an API key instead.

## Claude Code

Sign in:

```bash
claude mcp add --transport http databasify https://db.example.com/mcp
```

Add `--scope user` to use it in every project. Then run `/mcp` in Claude Code, choose **databasify** and sign in.

With an API key:

```bash
claude mcp add --transport http databasify https://db.example.com/mcp --header "Authorization: Bearer YOUR_API_KEY"
```

## Claude

1. In Claude, open **Customize → Connectors**, then **+ Add → Add custom connector**.
2. Name it Databasify and paste the MCP URL.
3. Choose **Sign in now**, then approve on the Databasify page that opens.

To use an API key instead, choose **No sign in** and add `Authorization: Bearer YOUR_API_KEY` under **Request headers**.

Claude connects from Anthropic's servers, so your Databasify must be reachable over public HTTPS.

## ChatGPT

1. On chatgpt.com, open **Plugins**, select **+**, then **Add custom MCP server**.
2. Name it Databasify, paste the MCP URL and pick **OAuth**.
3. Create it as a plugin, install it and sign in when ChatGPT asks.

ChatGPT only supports signing in, and it connects from OpenAI's servers, so your Databasify must be reachable over public HTTPS.

## Cursor

Add the server to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "databasify": {
      "url": "https://db.example.com/mcp"
    }
  }
}
```

Then open **Cursor Settings → MCP** and sign in to databasify.

With an API key, add a header and set `DATABASIFY_API_KEY` before you start Cursor:

```json
{
  "mcpServers": {
    "databasify": {
      "url": "https://db.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:DATABASIFY_API_KEY}"
      }
    }
  }
}
```

## VS Code

Add the server to `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "databasify": {
      "type": "http",
      "url": "https://db.example.com/mcp"
    }
  }
}
```

Start **databasify** from the MCP servers view. VS Code opens the sign-in page. For an API key, add `"headers": { "Authorization": "Bearer YOUR_API_KEY" }` to the server.

## Gemini CLI

Sign in:

```bash
gemini mcp add --transport http databasify https://db.example.com/mcp
```

Add `-s user` to use it in every project. Then run `/mcp auth databasify` in Gemini CLI.

With an API key:

```bash
gemini mcp add --transport http --header "Authorization: Bearer YOUR_API_KEY" databasify https://db.example.com/mcp
```

## Codex

Sign in:

```bash
codex mcp add databasify --url https://db.example.com/mcp
codex mcp login databasify
```

With an API key, add the server to `~/.codex/config.toml` and set `DATABASIFY_API_KEY` before you start Codex:

```toml
[mcp_servers.databasify]
url = "https://db.example.com/mcp"
bearer_token_env_var = "DATABASIFY_API_KEY"
```

## Zed

Add the server to your Zed `settings.json`:

```json
{
  "context_servers": {
    "databasify": {
      "url": "https://db.example.com/mcp"
    }
  }
}
```

Zed asks you to sign in the first time it connects. For an API key, add `"headers": { "Authorization": "Bearer YOUR_API_KEY" }` to the server.

## Other clients

Any MCP client that supports the Streamable HTTP transport can connect to the MCP URL. Clients that support MCP sign-in (OAuth 2.1 with dynamic client registration) find the sign-in page on their own. Other clients send `Authorization: Bearer YOUR_API_KEY` with every request.
