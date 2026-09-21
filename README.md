
# Trajectories of Engagement

[![Deploy to GitHub Pages](https://github.com/medialab/trajectories-of-engagement-2025/actions/workflows/sitebuilder.yml/badge.svg?branch=main)](https://github.com/medialab/trajectories-of-engagement-2025/actions/workflows/sitebuilder.yml)

<img width="1624" height="1061" alt="Screenshot 2026-09-21 at 11 40 16" src="https://github.com/user-attachments/assets/3d3a1a98-79b5-48ac-8edb-3265a637f55b" />

## What it is

**Trajectories of Engagement** is a research website accompanying a collective project and book on participatory and collaborative forms of inquiry.

The website presents 19 research projects through:

1. Project metadata and texts
2. Video presentations
3. Selected excerpts from workshop recordings
4. Original and annotated trajectory diagrams
5. An archive of all projects
6. A long form introduction to the research project

The production website is available at:

[trajectories.sciencespo.fr](https://trajectories.sciencespo.fr)

---

## How it is built

The website is a static SvelteKit application built with:

```text
SvelteKit
Svelte 5
TypeScript
Tailwind CSS 4
Bun
Vite
Three.js
Threlte (three JS for svelte)
Lenis (scroll hacking)
```

There is no database or CMS. The repository itself contains all the website data and media.

### Data

The main content source is:

[`src/lib/datasource.json`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/datasource.json)

It contains:

```text
website metadata
introduction
projects
project texts
video URLs
video excerpts
```

If you edit it, stuff will change in the published website.

### Projects

Each project has a unique `metadata.id`:

```json
{
	"metadata": {
		"id": "controverses-en-action",
		"title": "Controversies in Action",
		"year": "2021-2023",
		"project_leaders": "Robin de Mourat, Clémence Seurat, Thomas Tari",
		"research_center": "médialab (Sciences Po, France)"
	}
}
```

This ID connects all the different parts of a project:

```text
metadata.id
        ↓
project URL
        ↓
poster images
        ↓
social preview image
        ↓
sitemap
```

For example:

```text
controverses-en-action

/projects/controverses-en-action/

src/lib/assets/posters/controverses-en-action.png
src/lib/assets/posters/controverses-en-action_annotated.png

static/og/controverses-en-action.jpg
```

> [!IMPORTANT]
> The same project ID must be used everywhere to reference a unique project.

Project pages are generated automatically during publishing by:

[`src/routes/projects/[slug]/`](https://github.com/medialab/trajectories-of-engagement-2025/tree/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/routes/projects/%5Bslug%5D)

> [!IMPORTANT]
> There is no need to manually create a page for each project.

### Media

Trajectory diagrams are stored in:

[`src/lib/assets/posters/`](https://github.com/medialab/trajectories-of-engagement-2025/tree/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/assets/posters)

Each project normally has:

```text
PROJECT_ID.png
PROJECT_ID_annotated.png
```

The website overlays the two images with an interactive slider implemented in:

[`src/lib/comps/poster.svelte`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/comps/poster.svelte)

Project videos and workshop excerpts are handled by:

[`src/lib/comps/vid.svelte`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/comps/vid.svelte)


### SEO

SEO configuration is handled in:

[`src/lib/seo.ts`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/seo.ts)

The website includes:

```text
Open Graph metadata
Twitter cards
canonical URLs
JSON-LD
robots.txt
sitemap.xml
llms.txt
```

The sitemap is generated automatically before every build using:

[`scripts/generate-sitemap.mjs`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/scripts/generate-sitemap.mjs)

## Maintenance

### Edit a project

All project content is stored in:

[`src/lib/datasource.json`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/datasource.json)

A project can contain:

```json
{
	"metadata": {
		"id": "my-project",
		"title": "My Project",
		"year": "2024-2026",
		"project_leaders": "Person One, Person Two",
		"research_center": "Research Centre"
	},
	"texts": {
		"presentation": "Project presentation.",
		"experience": "Research experience.",
		"concept": "Reflection on trajectories of engagement."
	},
	"presentationURL": "https://www.youtube.com/watch?v=VIDEO_ID",
	"excerpts": [
		{
			"type": "discussion",
			"timecodes": ["0:12:30", "0:18:45"]
		}
	]
}
```

### Add a project

1. Add the project to `datasource.json`.
2. Choose a unique `metadata.id`.
3. Add the two poster files using the same ID:

```text
src/lib/assets/posters/PROJECT_ID.png
src/lib/assets/posters/PROJECT_ID_annotated.png
```

4. Add the social preview image:

```text
static/og/PROJECT_ID.jpg
```

5. Commit and push to `main`.

The project page and sitemap entry are generated automatically.

### Edit the introduction

The About page content is stored inside:

```text
datasource.json
└── intro
    └── fromBook
        └── markdown
```

The Markdown is rendered by:

[`src/routes/about/+page.svelte`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/routes/about/%2Bpage.svelte)

### Edit global website information

Edit:

[`src/lib/site.json`](https://github.com/medialab/trajectories-of-engagement-2025/blob/941b2795482cca3aeaa1105e3cbd6084ab7c3912/src/lib/site.json)

for:

```text
website URL
website name
global description
About description
Archive description
default social image
```

### Local development

```bash
git clone https://github.com/medialab/trajectories-of-engagement-2025.git
cd trajectories-of-engagement-2025

curl -fsSL https://bun.sh/install | bash

bun install
bun run dev
```

### Useful commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run build` | Generate the sitemap and build the website |
| `bun run preview` | Preview the production build |
| `bun run check` | Run Svelte and TypeScript checks |
| `bun run format` | Format the repository |
| `bun run lint` | Check repository formatting |

> [!IMPORTANT]
> Before pushing changes involving a project, check that its `metadata.id`, poster filenames and Open Graph filename all match exactly.
