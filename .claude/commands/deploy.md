---
description: Deploy the MCP server to Cloudflare Workers
allowed-tools: Bash, Read
---

# Deploy to Cloudflare

Deploy the LinkedIn Scraper MCP server to Cloudflare Workers.

## Pre-flight Check
- Wrangler config: !`cat wrangler.jsonc 2>/dev/null | head -20 || echo "not found"`
- Dependencies: !`npm ls --depth=0 2>/dev/null | head -10 || echo "run npm install first"`

## Steps

1. Verify wrangler.jsonc exists and has APIFY_API_KEY configured
2. Check if user is logged into Cloudflare (`wrangler whoami`)
3. If not logged in, run `wrangler login`
4. Run `npm run deploy`
5. Capture the deployed URL
6. Generate updated MCP client config with the production URL
7. Remind user to update their Claude Desktop/Cursor config with the new URL

After deployment, provide the SSE endpoint URL (ends with `/sse`).
