## Trajectories of Engagement (2025)

A research showcase exploring how researchers and external actors meet, collaborate and co‑create knowledge across physical and digital settings to address public issues. The site presents a curated set of projects from the humanities and social sciences, highlighting their participatory “trajectories of engagement,” the socio‑technical choices involved, and reflections from practitioners.

> A living observatory of participatory research practices across HSS projects.
🌐 **Website**: [https://medialab.github.io/trajectories-of-engagement-2025/](https://medialab.github.io/trajectories-of-engagement-2025/)

<details>
<summary><strong>Abstract</strong></summary>

Trajectories of engagement refer to moments in the research process where external actors are involved and co‑construct knowledge with the research team. These research paths involving an outside can take various forms of material production based on physical and/or digital environments. Often used in digital data‑grounded labs or citizen science projects, trajectories of engagement are shaped in research which aims to address social concerns or public issues.

This research project aims to explore and describe the different forms that trajectories of engagement can take in the humanities and social sciences, the interactions between internal and external actors that they can generate, and the materiality of the socio‑technical choices involved. The expected outputs are to build an observatory and a network of researchers interested in studying these trajectories and a book will be written to present the identified trajectories.

</details>

## What’s in the website

- **Home**: An interactive 3D carousel of project posters. Hovering highlights a project and shows contextual info; clicking opens its detail page.
- **Archive**: A sortable table of all projects with dates, title, authors, institutions and a link to the presentation video.
- **Project pages**: For each project you’ll find:
  - **Metadata**: title, dates, project leaders, research center.
  - **Texts (when available)**: presentation, experience, concept.
  - **Video player with excerpts**: embedded YouTube with a “Next segment” control that jumps through curated timecodes.
  - **Poster viewer**: compare original and annotated posters using a blend slider.
- **About + contact**: Project background and a contact link.

## Data model and assets

- **Datasource**: `src/lib/datasource.json` contains the site metadata and the list of projects with fields such as `metadata` (id, title, year, project_leaders, research_center), `presentationURL`, `texts` (optional presentation/experience/concept), and `excerpts` (typed segments with timecodes for the video player).
- **Posters**: Stored in `src/lib/assets/posters/` as `{id}.png` and `{id}_annotated.png`. These power both the home carousel and the poster comparison on project pages.

### Data model fields

| Field | Type | Description |
| --- | --- | --- |
| `metadata.id` | string | Route slug and poster filename stem |
| `metadata.title` | string | Project title |
| `metadata.year` | string | Year or range (e.g., `2020 - 2023`) |
| `metadata.project_leaders` | string | Author(s) / coordinator(s) |
| `metadata.research_center` | string | Institution(s) |
| `presentationURL` | string | Video URL (YouTube supported) |
| `texts.presentation` | string | Project presentation (optional) |
| `texts.experience` | string | Field notes / lived experience (optional) |
| `texts.concept` | string | Conceptual framing (optional) |
| `excerpts[].type` | string | Segment label (e.g., `discussion`, `debriefing`) |
| `excerpts[].timecodes[]` | string[] | Start–end pairs as `m:s` or `h:m:s` strings |

### Example project entry

```json
{
  "metadata": {
    "id": "coeso",
    "title": "COESO : Collaborative Engagement on Societal Issues",
    "year": "2020 - 2023",
    "project_leaders": "Alessia Smaniotto",
    "research_center": "EHESS / OpenEdition"
  },
  "texts": {
    "presentation": "…",
    "experience": "…",
    "concept": "…"
  },
  "presentationURL": "https://www.youtube.com/watch?v=YtZkeY22YYM",
  "excerpts": [
    { "type": "discussion", "timecodes": ["1:11:46", "1:19:59"] },
    { "type": "discussion", "timecodes": ["1:26:35", "1:30:51"] }
  ]
}
```

## Routes

| Path | Section | Notes |
| --- | --- | --- |
| `/` | Home | Interactive 3D poster carousel |
| `/archive` | Archive | Sort by year, title, author, institution, link |
| `/projects/[slug]` | Project | Video with curated segments + poster comparison |
| `/about` | About | Project background and contact link |

## Credits

- **Creators**: Marta Severo, Robin de Mourat, Donato Ricci, Élie Petit.
- **Design & Development**: Tommaso Prinetti.
- **Institutions**: medialab Sciences Po, Université Paris Nanterre.

## Tech highlights

- SvelteKit front‑end with custom components and stores
- Threlte/Three.js for the 3D poster carousel
- YouTube embed with curated segment navigation

### Feature checklist

- [x] Interactive 3D poster carousel on Home
- [x] Sortable archive table
- [x] Project pages with YouTube segments
- [x] Poster comparison slider (original vs annotated)
- [x] About page and mailto contact

