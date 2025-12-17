import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Types for job results
interface LinkedInJob {
	title: string;
	company: string;
	location: string;
	link: string;
	postedAt?: string;
	salary?: string;
}

interface IndeedJob {
	title: string;
	company: string;
	location: string;
	url: string;
	posted?: string;
	salary?: string;
}

// Apify actor endpoints
const APIFY_ACTORS = {
	linkedin: "bebity~linkedin-jobs-scraper",
	indeed: "misceres~indeed-scraper",
} as const;

// Helper to call Apify sync API
async function callApify<T>(
	actor: string,
	input: Record<string, unknown>,
	apiKey: string
): Promise<T[]> {
	const url = new URL(
		`https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items`
	);
	url.searchParams.set("token", apiKey);

	const response = await fetch(url.toString(), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(
			`Apify API error (${response.status}): ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
		);
	}

	return response.json();
}

// Format job results for display
function formatLinkedInJobs(jobs: LinkedInJob[]): string {
	if (!jobs.length) return "No jobs found matching your criteria.";

	return jobs
		.map(
			(job, i) =>
				`${i + 1}. **${job.title}** at ${job.company}\n` +
				`   Location: ${job.location}\n` +
				`   ${job.salary ? `Salary: ${job.salary}\n   ` : ""}` +
				`   ${job.postedAt ? `Posted: ${job.postedAt}\n   ` : ""}` +
				`   Link: ${job.link}`
		)
		.join("\n\n");
}

function formatIndeedJobs(jobs: IndeedJob[]): string {
	if (!jobs.length) return "No jobs found matching your criteria.";

	return jobs
		.map(
			(job, i) =>
				`${i + 1}. **${job.title}** at ${job.company}\n` +
				`   Location: ${job.location}\n` +
				`   ${job.salary ? `Salary: ${job.salary}\n   ` : ""}` +
				`   ${job.posted ? `Posted: ${job.posted}\n   ` : ""}` +
				`   Link: ${job.url}`
		)
		.join("\n\n");
}

// MCP Server
export class JobScraperMCP extends McpAgent {
	server = new McpServer({
		name: "LinkedIn Scraper MCP",
		version: "1.0.0",
	});

	private apiKey: string = "";

	setApiKey(key: string) {
		this.apiKey = key;
	}

	async init() {
		// LinkedIn Jobs Scraper
		this.server.tool(
			"scrape_linkedin_jobs",
			{
				jobTitle: z
					.string()
					.describe("Job title to search (e.g., 'Software Engineer')"),
				location: z
					.string()
					.optional()
					.describe("Location filter (e.g., 'San Francisco, CA' or 'Remote')"),
				maxResults: z
					.number()
					.min(1)
					.max(100)
					.default(10)
					.describe("Number of results to return"),
				experienceLevel: z
					.enum([
						"Internship",
						"Entry level",
						"Associate",
						"Mid-Senior level",
						"Director",
						"Executive",
					])
					.optional()
					.describe("Filter by experience level"),
				jobType: z
					.enum([
						"Full-time",
						"Part-time",
						"Contract",
						"Temporary",
						"Volunteer",
						"Internship",
						"Other",
					])
					.optional()
					.describe("Filter by job type"),
				companyName: z
					.array(z.string())
					.optional()
					.describe("Filter by specific companies"),
			},
			async ({
				jobTitle,
				location,
				maxResults,
				experienceLevel,
				jobType,
				companyName,
			}) => {
				if (!this.apiKey) {
					return {
						content: [
							{
								type: "text",
								text: "Error: APIFY_API_KEY not configured. Add it to wrangler.jsonc vars.",
							},
						],
					};
				}

				try {
					const input = {
						title: jobTitle,
						location: location || "",
						rows: maxResults,
						companyName: companyName || [],
						experienceLevel: experienceLevel || "",
						jobType: jobType || "",
						proxy: {
							useApifyProxy: true,
							apifyProxyGroups: ["RESIDENTIAL"],
						},
					};

					const jobs = await callApify<LinkedInJob>(
						APIFY_ACTORS.linkedin,
						input,
						this.apiKey
					);

					return {
						content: [
							{
								type: "text",
								text: `Found ${jobs.length} LinkedIn job(s):\n\n${formatLinkedInJobs(jobs)}`,
							},
						],
					};
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unknown error";
					return {
						content: [
							{ type: "text", text: `Error scraping LinkedIn: ${message}` },
						],
					};
				}
			}
		);

		// Indeed Jobs Scraper
		this.server.tool(
			"scrape_indeed_jobs",
			{
				position: z
					.string()
					.describe("Job position to search (e.g., 'web developer')"),
				country: z
					.string()
					.default("US")
					.describe("Country code (e.g., 'US', 'UK', 'CA')"),
				location: z
					.string()
					.optional()
					.describe("City or region filter"),
				maxItems: z
					.number()
					.min(1)
					.max(100)
					.default(50)
					.describe("Number of results to return"),
				parseCompanyDetails: z
					.boolean()
					.default(false)
					.describe("Fetch detailed company info (slower)"),
			},
			async ({ position, country, location, maxItems, parseCompanyDetails }) => {
				if (!this.apiKey) {
					return {
						content: [
							{
								type: "text",
								text: "Error: APIFY_API_KEY not configured. Add it to wrangler.jsonc vars.",
							},
						],
					};
				}

				try {
					const input = {
						position,
						country,
						location: location || "",
						maxItems,
						parseCompanyDetails,
						saveOnlyUniqueItems: true,
						followApplyRedirects: false,
					};

					const jobs = await callApify<IndeedJob>(
						APIFY_ACTORS.indeed,
						input,
						this.apiKey
					);

					return {
						content: [
							{
								type: "text",
								text: `Found ${jobs.length} Indeed job(s):\n\n${formatIndeedJobs(jobs)}`,
							},
						],
					};
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unknown error";
					return {
						content: [
							{ type: "text", text: `Error scraping Indeed: ${message}` },
						],
					};
				}
			}
		);
	}
}

// Cloudflare Workers export
export default {
	async fetch(request: Request, env: { APIFY_API_KEY?: string }) {
		const mcp = new JobScraperMCP();
		mcp.setApiKey(env.APIFY_API_KEY || "");
		await mcp.init();
		return mcp.run(request);
	},
};
