---
description: Quick job search across LinkedIn and Indeed
argument-hint: <job-title> [location]
---

# Job Search

Search for jobs matching: $ARGUMENTS

Use the MCP tools `scrape_linkedin_jobs` and `scrape_indeed_jobs` to find matching positions.

## Instructions

1. Parse the job title and optional location from the arguments
2. Search LinkedIn first (faster, more professional roles)
3. If location is "remote" or not specified, search broadly
4. Present results in a clean table format:
   - Job Title
   - Company
   - Location
   - Posted Date (if available)
   - Key Requirements (brief)
5. Highlight any notable findings (high salaries, interesting companies, remote options)

Keep the summary concise - users can ask for more details on specific listings.
