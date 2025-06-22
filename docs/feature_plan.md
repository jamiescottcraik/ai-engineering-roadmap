# AGENT Feature Plan: AI Engineering Roadmap Modernization

## Objective
To systematically transform the `ai-engineering-roadmap` repository into a modular, interactive, error-free, contributor-friendly learning platform—modeled on the best practices from [developer-roadmap](https://github.com/kamranahmedse/developer-roadmap), and incorporating all actionable links, enrolled courses, and resource types (courses, projects, notes, screenshots, etc.). The AGENT should commit regularly, proactively test and remove errors, keep the scaffold optimized, and document all major changes.

---

## 1. Repo Structure & Modularity

- [ ] **Restructure repository** for clarity:
    - `/roadmaps/` for all JSON/YAML curriculum and roadmap data (modular, versioned)
    - `/assets/` for images, diagrams, screenshots, code visuals
    - `/notes/` for markdown notes, study logs, code explanations (organized by phase or course)
    - `/code/` for project code, scripts, and Jupyter notebooks
    - `/public/` for generated SVG/PNG/interactive roadmap diagrams
    - `/scripts/` for validation, roadmap generation, and automation tools

---

## 2. Scaffold Optimization & File Hygiene

- [ ] **Regularly optimize scaffold**:
    - Remove or archive bulk, redundant, or deprecated files and folders
    - Keep only essential, up-to-date resources and documentation in the main structure
    - Document any automated or manual removals in commit messages or a `CHANGELOG.md`
    - Ensure that all top-level directories and files serve a clear ongoing purpose

---

## 3. Curriculum & Resource Integration

- [ ] **Populate all phases and roadmap data** with:
    - All enrolled course links, marked as `critical`
    - Practice platforms, project-based resources, and assessment links
    - Books, blogs, newsletters, and OSS repos (in resource overview and as reference nodes)
    - Rationale, time estimates, and outcomes for each resource (where possible)
- [ ] **Maintain and regularly update** `RESOURCE_OVERVIEW.md` with all actionable links and categorized resource tables

---

## 4. Contributor Experience & Community

- [ ] **Add/Update**: `README.md` with mission, visual previews, usage, and contribution guidance
- [ ] **Add**: `CONTRIBUTING.md` (how to add resources, notes, errors, or enhancements)
- [ ] **Add**: `.github/ISSUE_TEMPLATE/` for bug, enhancement, and roadmap suggestion templates
- [ ] **Add**: `CODE_OF_CONDUCT.md`, `LICENSE`, `SECURITY.md` for OSS health

---

## 5. Visual, Interactive Roadmaps

- [ ] **Generate visual roadmaps** from JSON/YAML using Mermaid, draw.io, D3, or similar
- [ ] **Automate SVG/PNG generation** on commit or with scripts
- [ ] **Link visuals** in README and resource overviews
- [ ] **Preview node details** (title, description, actionable links) in roadmap UI

---

## 6. Notes, Screenshots, and Code Uploads

- [ ] **Enable upload and organization** of:
    - Markdown notes for courses and projects (in `/notes/`)
    - Screenshots and diagrams (in `/assets/`)
    - Code files and notebooks (in `/code/`)
- [ ] **Reference notes/screenshots** from within roadmap/resource markdown and docs

---

## 7. Progress Tracking & Interactivity

- [ ] **Implement checklists** and progress markers in roadmap files and notes (manual at first, automate if possible)
- [ ] **Allow contributors/users to mark completion** (via issues, PRs, or UI if static site is added)
- [ ] **Optionally**: Deploy as a static docs site (Docusaurus/VitePress/MkDocs) for richer interaction

---

## 8. Automation & Quality Assurance

- [ ] **Add validation scripts** for JSON/YAML roadmap data and resource links
- [ ] **Enable CI for PRs**: test structure, lint, validate links, and check for broken/duplicate resources
- [ ] **Automate regular commits** with clear messages on errors fixed, resources added, or structure improved

---

## 9. Documentation & Maintenance

- [ ] **Maintain**: `AGENT.md` with ongoing contributor/agent best practices
- [ ] **Document**: file/folder structure, progress tracking, and contribution flow in `README.md` and `CONTRIBUTING.md`
- [ ] **Keep all logs of commits, error removals, and testing in commit messages and in a `CHANGELOG.md`**

---

## 10. Testing & Error Removal

- [ ] **Test all scripts and roadmap data** after each major change
- [ ] **Remove errors, broken links, and duplication** as pre-commit or CI step
- [ ] **Document all fixes and improvements**

---

## 11. Regular Commit Practice

- [ ] **Commit regularly, after each major resource integration or bug fix**
- [ ] **Write descriptive commit messages** (e.g., "Added enrolled course links to phase 1", "Fixed broken roadmap node", "Removed duplicate SQL resource")

---

## 12. Advanced Features (Optional/Future)

- [ ] **Interactive progress UI**: Allow users to upload notes/screenshots or check off completed items via web UI
- [ ] **User/journal uploads**: Accept and display personal notes and code screenshots (manually now, automate later)
- [ ] **Automated summary generation**: Summarize progress, popular resources, and open issues regularly

---

## Success Criteria

- All actionable course/practice/project/resource links are present, organized, and easily discoverable
- All enrolled courses are included, marked as critical in the JSON and Markdown overview
- Books, blogs, OSS and newsletters remain fully referenced
- Notes, screenshots, and code uploads are supported via clear directory structure and contributor docs
- Repo is modular, maintainable, and contributor-friendly (mirroring best practices from developer-roadmap)
- Scaffold remains optimized, with no redundant or bulk files
- Errors and broken links are regularly tested for and rapidly fixed
- Commits are frequent and clearly documented

---

_Last updated: 2025-06-22 by @jamiescottcraik_