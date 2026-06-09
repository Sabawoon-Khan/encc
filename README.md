# ENCC ERP Requirements Hub

Living documentation portal for ENCC ERP business requirements — built for analysts, client workshops, and developers.

## Quick start

```bash
cd encc-requirements
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What this project does

- **Module overview pages** — explain what each department does, executives, and included sections
- **Section detail pages** — fields, workflows, business rules (Template v2.2 format)
- **Glossary** — shared terminology across modules
- **Evidence uploads** — attach form scans, Paper 1.1 samples, screenshots for developers

## Project structure

```
src/
  content/
    glossary.ts              # Shared terms — edit here
    modules/
      index.ts               # Register all modules
      opr/
        index.ts             # Operations module metadata
        archive.ts           # Archive section (fields, workflows, rules)
  types/requirements.ts      # TypeScript types for all content
  components/                # UI components
  app/                       # Next.js pages
content/
  evidence-manifest.json     # Upload metadata (auto-updated)
public/
  uploads/                   # Uploaded images/PDFs
```

## Adding a new module

1. Create `src/content/modules/{id}/index.ts` with module metadata
2. Add section files e.g. `src/content/modules/{id}/sales.ts`
3. Register in `src/content/modules/index.ts`:

```ts
import { newModule } from "./new-module";
export const modules = [oprModule, newModule];
```

## Adding a new section to an existing module

1. Create `src/content/modules/opr/sales.ts` exporting a `SectionDefinition`
2. Import and add to `sections` array in `src/content/modules/opr/index.ts`

## Content format

Each section follows Shams Hilal Template v2.2:

- Summary bullets
- Entities with field tables (name, type, required, example, rules)
- Workflows with steps
- Business rules (BR-{MODULE}-001)
- Status: `draft` | `in_review` | `verified` | `pending`

## Evidence uploads

On any documented section page, use **Upload Evidence** to attach:

- Paper form scans (e.g. Archive Paper 1.1)
- Outgoing letter templates
- Workshop photos

Files save to `public/uploads/{moduleId}/{sectionId}/` and metadata to `content/evidence-manifest.json`.

## Related files

- HTML export (print/PDF): `../encc/new/encc-module-opr-operations.html`
- Template reference: `../encc/new/ENCC ERP Requirements Output Template__V2. 2.pdf`

## Scripts

| Command       | Description          |
|---------------|----------------------|
| `npm run dev` | Development server   |
| `npm run build` | Production build   |
| `npm start`   | Run production build |

---

Yaqeen Technology · ENCC ERP Requirements Gathering · Template v2.2
