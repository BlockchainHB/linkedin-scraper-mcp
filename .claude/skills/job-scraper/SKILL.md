---
name: job-scraper
description: Search and scrape job listings from LinkedIn and Indeed. Use when the user wants to find jobs, search job markets, analyze hiring trends, or look up positions at specific companies.
---

# Job Scraper MCP Skill

This skill enables job market intelligence by scraping LinkedIn and Indeed via MCP tools.

## Available Tools

Once the MCP server is connected, you have access to:

### scrape_linkedin_jobs
Search LinkedIn for job listings with filters:
- `jobTitle` (required) - e.g., "Software Engineer", "Product Manager"
- `location` - e.g., "San Francisco, CA", "Remote"
- `maxResults` - 1-100 (default: 10)
- `experienceLevel` - Internship, Entry level, Associate, Mid-Senior level, Director, Executive
- `jobType` - Full-time, Part-time, Contract, Temporary, Volunteer, Internship
- `companyName` - Array of company names to filter

### scrape_indeed_jobs
Search Indeed for job listings:
- `position` (required) - e.g., "web developer", "data scientist"
- `country` - Country code (default: "US")
- `location` - e.g., "New York", "Austin"
- `maxItems` - 1-100 (default: 50)
- `parseCompanyDetails` - Include detailed company info (slower)

## Usage Patterns

When user asks to find jobs:
1. Determine which platform(s) to search (LinkedIn, Indeed, or both)
2. Extract job title/position, location, and any filters from request
3. Call the appropriate tool(s)
4. Summarize results with key details: title, company, location, salary (if available)

When user asks about job market trends:
1. Search both platforms for broader data
2. Analyze patterns in results
3. Present insights on demand, salary ranges, common requirements

## Example Queries

- "Find remote senior React developer jobs" -> scrape_linkedin_jobs with jobTitle="Senior React Developer", location="Remote"
- "What data science jobs are available in Austin?" -> scrape both platforms for "data scientist" in "Austin"
- "Search for entry-level marketing roles at Google or Meta" -> scrape_linkedin_jobs with companyName=["Google", "Meta"], experienceLevel="Entry level"
