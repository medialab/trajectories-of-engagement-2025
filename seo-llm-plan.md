# LLM SEO Optimization Plan - trajectories.sciencespo.fr

## Executive summary
This SvelteKit static site already exposes key content, but it lacks a sitemap, structured data, and page-specific metadata. For LLM visibility and traditional SEO, the highest-impact work is: add a sitemap, fix canonical and social metadata on secondary pages, introduce JSON-LD for the organization and project pages, and add answer-first summaries and FAQs for core concepts. These changes will improve crawlability, retrievability, and citation likelihood without changing the visual design.

## Assumptions and inputs
- Repo path: `/Users/tommasoprinetti/Documents/Website_Trajectoires`
- Primary domain: `https://trajectories.sciencespo.fr` (from `src/lib/utils.ts`)
- Site type: academic research project and book showcase
- Target audience: researchers, students, practitioners, and participants in participatory research
- Primary goals: LLM visibility and credible citations; secondary goal is discoverability of projects and the book
- Priority pages: home, about, archive, project detail pages
- Analytics: none provided
- Output file: `seo-llm-plan.md`

## Inventory snapshot
- Framework/CMS: SvelteKit with adapter-static
- Content locations: `src/lib/datasource.json`, `src/routes/+page.svelte`, `src/routes/about/+page.svelte`, `src/routes/archive/+page.svelte`, `src/routes/projects/[slug]/+page.svelte`
- Key SEO files: `static/robots.txt`
- OG assets: `static/Thumb.jpg`, `static/og/*`
- Missing: `sitemap.xml`, `llms.txt`, JSON-LD structured data

## Findings
### LLM discoverability and indexability
- Robots allows crawling, but there is no sitemap reference or sitemap file to guide discovery. `static/robots.txt`.
- No `llms.txt` exists. Adding it can guide LLM crawlers to high-value pages.
- Canonical and OG URLs for about and archive pages are set to the homepage, which can suppress indexing of those pages. `src/routes/about/+page.svelte`, `src/routes/archive/+page.svelte`.

### Content structure and answers
- The site is narrative and visual, but it lacks answer-first summaries and question-style headings on core pages.
- Project pages have sections (Presentation, Experience, Concept) but do not lead with a concise TL;DR.
- There is no FAQ or definitional page for key concepts like “trajectories of engagement.”

### Trust and credibility
- Credits are present, but author bylines, affiliations, and “last updated” dates are not consistently displayed.
- The about page uses long-form prose without explicit citations or references.

### Structured data and metadata
- No JSON-LD schema present across pages.
- Social metadata is present, but `twitter:card` is set to a title instead of a valid card type on several pages. `src/routes/+page.svelte`, `src/routes/about/+page.svelte`, `src/routes/archive/+page.svelte`.
- Page titles and descriptions are identical across home, about, and archive pages, reducing relevance for search and LLM retrieval.

### Technical SEO
- No sitemap generation process identified.
- No explicit `Organization`, `WebSite`, `WebPage`, `Article/ScholarlyArticle`, or `VideoObject` schema to support citation and rich results.
- Video content has no transcript or text summary for retrieval.

## Opportunities and gaps
- Define and surface the project concept with a dedicated, answer-first page.
- Add structured summaries and FAQ blocks for the home and about pages.
- Add a citation and reuse guidance page for the book, posters, and videos.
- Provide a thematic project index (by method, discipline, or topic) to align with question-oriented queries.

## Recommendations (prioritized)
| Priority | Area | Page/Path | Recommendation | Rationale | Effort |
|---|---|---|---|---|---|
| Now | Indexability | `static/robots.txt` | Add `Sitemap: https://trajectories.sciencespo.fr/sitemap.xml` and generate a sitemap. | Improves discovery and freshness for search engines and LLM retrieval. | Medium |
| Now | Metadata | `src/routes/about/+page.svelte` | Use a page-specific title, description, OG URL, and canonical URL. | Avoids canonical conflicts and improves relevance. | Low |
| Now | Metadata | `src/routes/archive/+page.svelte` | Use a page-specific title, description, OG URL, and canonical URL. | Same as above. | Low |
| Now | Social meta | `src/routes/+page.svelte` | Set `twitter:card` to `summary_large_image`. | Valid card type increases rich preview compatibility. | Low |
| Now | Social meta | `src/routes/about/+page.svelte` | Set `twitter:card` to `summary` or `summary_large_image`. | Valid card type for consistent previews. | Low |
| Now | Social meta | `src/routes/archive/+page.svelte` | Set `twitter:card` to `summary` or `summary_large_image`. | Valid card type for consistent previews. | Low |
| Now | Structured data | `src/routes/+layout.svelte` | Add JSON-LD for `Organization` and `WebSite` with `name`, `url`, `sameAs`, and `description`. | Helps LLMs and search engines understand entity context. | Medium |
| Next | Structured data | `src/routes/projects/[slug]/+page.svelte` | Add JSON-LD for `ScholarlyArticle` or `CreativeWork` with title, description, date, author, and affiliation. | Improves citation likelihood and entity disambiguation for project pages. | Medium |
| Next | Content structure | `src/routes/projects/[slug]/+page.svelte` | Add a TL;DR summary block and headings like “Project summary”, “Methods”, “Findings”, “Participants”. | Answer-first structure improves retrieval and user clarity. | Medium |
| Next | Content structure | `src/routes/about/+page.svelte` | Add a short summary and FAQ section with question-style headings. | Captures long-tail, LLM-friendly queries. | Medium |
| Next | Media | `src/lib/comps/vid.svelte` | Add transcript text or a summarized text block per video and expose it in page content. | LLMs need text to retrieve video content. | Medium |
| Later | Discoverability | `static/llms.txt` | Create optional `llms.txt` listing top pages and project index. | Emerging best practice for LLM crawlers. | Low |
| Later | Content IA | `src/routes/archive/+page.svelte` | Add filters by theme, method, and geography and expose them as headings. | Creates topic clusters for retrieval and navigation. | Medium |

## Content briefs (new or expanded)
1. **What are “trajectories of engagement”?**
Direct answer summary: One to two sentences defining the concept and its research context.
Recommended sections: Origin of the concept, methodology, why it matters, how it is used in the book.
Schema: `Article` or `ScholarlyArticle` plus `FAQPage` for common questions.
Trust signals: Authors, affiliations, and a “last updated” date.

2. **How to access the book and cite it**
Direct answer summary: Where the book can be read or downloaded and how to cite it.
Recommended sections: Access links, citation formats, licensing, contact.
Schema: `Book` with `author`, `publisher`, `datePublished`.
Trust signals: DOI or official repository link if available.

3. **Project index by theme/method**
Direct answer summary: Explain that projects are organized by thematic or methodological tags.
Recommended sections: Themes, methods, geography, and a list of projects per cluster.
Schema: `ItemList` or `CollectionPage`.
Trust signals: Editorial note on classification method.

4. **FAQ: Participatory research and engagement**
Direct answer summary: Short Q and A on common misunderstandings (tokenism, ethics, data ownership).
Recommended sections: 6 to 10 Q and A items.
Schema: `FAQPage`.
Trust signals: Cited sources and author credentials.

## Measurement and monitoring
- Verify indexing in Search Console for main pages and a sample of project pages.
- Track impressions and clicks for concept and project-related queries.
- Maintain a simple log of LLM citations and mentions (manual or automated) as a KPI.

## File list and next steps
- `static/robots.txt`
- `static/llms.txt` (new)
- `static/sitemap.xml` (new)
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/routes/about/+page.svelte`
- `src/routes/archive/+page.svelte`
- `src/routes/projects/[slug]/+page.svelte`
- `src/lib/datasource.json` (for structured data fields like author, date, tags)

## Open questions
- Is `https://trajectories.sciencespo.fr` the correct primary domain and canonical base?
- What are the top priority pages for discoverability (home, about, archive, specific projects)?
- Are there existing analytics, Search Console data, or target keywords to incorporate?
- Should the site emphasize book access, project discovery, or conceptual explanation first?
- Are there licensing or citation requirements that should be surfaced prominently?

## Guardrails
- Do not edit site code unless explicitly asked.
- Do not invent analytics or rankings; mark unknowns as assumptions.
- Prefer evidence-backed recommendations over speculative ones.

## Resources
- `references/framework.md` - LLM SEO principles distilled from the provided framework
