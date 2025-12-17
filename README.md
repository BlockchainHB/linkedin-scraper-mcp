# LinkedIn Scraper MCP

A remote MCP server for job scraping. Runs on Cloudflare Workers, uses Apify for scraping.

## Quick Start

```bash
git clone https://github.com/BlockchainHB/linkedin-scraper-mcp.git
cd linkedin-scraper-mcp
npm install
```

Add your [Apify API key](https://apify.com/) to `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "APIFY_API_KEY": "your_key_here"
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `scrape_linkedin_jobs` | Search LinkedIn for job listings |
| `scrape_indeed_jobs` | Search Indeed for job listings |

## Development

```bash
npm run dev     # Local server at localhost:8787
npm run deploy  # Deploy to Cloudflare Workers
```

## Claude Code Integration

This repo includes native Claude Code support with skills and slash commands.

### Slash Commands

| Command | Description |
|---------|-------------|
| `/install` | Interactive setup wizard for Claude Desktop or Cursor |
| `/search-jobs <title> [location]` | Quick job search |
| `/deploy` | Deploy to Cloudflare with config generation |

### Auto-Discovery Skill

The included skill (`.claude/skills/job-scraper/`) enables Claude to automatically use job scraping when you ask about jobs, hiring trends, or job market data.

## Connect to Claude Desktop

Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "job-scraper": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-worker.workers.dev/sse"]
    }
  }
}
```

## Connect to Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "job-scraper": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-worker.workers.dev/sse"]
    }
  }
}
```

## Usage Examples

Once connected:

- "Find remote senior React developer jobs"
- "Search for data science positions in Austin"
- "What entry-level marketing roles are at Google?"

### LinkedIn Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `jobTitle` | Yes | Job title to search |
| `location` | No | Location or "Remote" |
| `maxResults` | No | 1-100 (default: 10) |
| `experienceLevel` | No | Internship, Entry level, Associate, Mid-Senior level, Director, Executive |
| `jobType` | No | Full-time, Part-time, Contract, etc. |
| `companyName` | No | Array of company names |

### Indeed Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `position` | Yes | Job position to search |
| `country` | No | Country code (default: US) |
| `location` | No | City or region |
| `maxItems` | No | 1-100 (default: 50) |
| `parseCompanyDetails` | No | Include company info (slower) |

## Author

[@hasaamb](https://twitter.com/hasaamb)

## License

MIT
