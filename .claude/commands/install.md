---
description: Install and configure the LinkedIn Scraper MCP server
allowed-tools: Bash, Read, Write, Edit
---

# Install LinkedIn Scraper MCP

Help me set up the LinkedIn Scraper MCP server for Claude Desktop or Cursor.

## Current Environment
- OS: !`uname -s`
- Node version: !`node --version 2>/dev/null || echo "not installed"`
- npm version: !`npm --version 2>/dev/null || echo "not installed"`

## Steps

1. Check if Node.js 18+ is installed, if not provide installation instructions
2. Clone or verify the repo exists
3. Run `npm install`
4. Check if wrangler is configured with an Apify API key
5. Determine if user wants local dev or cloud deployment
6. Generate the appropriate MCP client config for their setup:
   - For Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
   - For Cursor: `.cursor/mcp.json` in project root
7. Provide next steps and usage examples

Be concise but thorough. Ask if they have an Apify API key ready.
