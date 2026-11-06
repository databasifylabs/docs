# Databasify docs

Source of [docs.databasify.io](https://docs.databasify.io), the documentation for [Databasify](https://github.com/databasifylabs/databasify).

## Contributing

Fixes and improvements are welcome. Every page has an **Edit on GitHub** link.

1. Fork the repo and create a branch from `main`.
2. Run it locally (Node.js 22):

   ```bash
   npm install
   npm run dev
   ```

3. Edit the Markdown in `content/docs`. Each folder is a sidebar section; its `meta.json` sets the page order.
4. Check it builds with `npm run build`, then open a pull request.

Keep pages short, plain and accurate to how Databasify actually behaves. For product bugs or features, use the [main repository](https://github.com/databasifylabs/databasify).
