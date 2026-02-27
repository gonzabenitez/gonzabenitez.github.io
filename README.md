
---

# 🌌 Automated Portfolio Ecosystem

### [gonzabenitez.github.io](https://gonzabenitez.github.io)

This is not just a portfolio—it's a **self-maintaining data pipeline**. It uses GitHub as a headless CMS, Python as an automated curator, and Next.js as a high-performance presentation layer.

## 🛠️ System Overview

The ecosystem is divided into three specialized segments that interact via **GitHub Actions**:

### 1. [The Data Engine (`/scripts`)](./scripts/README.md)

* **Role**: Orchestrator & Curator.
* **Tech**: Python + `uv` + PyGithub.
* **Function**: Scans my GitHub profile, resolves live demos (Pages/CNAME), and calculates "staleness" to decide when to refresh project thumbnails via the Microlink API.

### 2. [The State Layer (`/data` & `/assets`)](./assets/README.md)

* **Role**: Permanent Storage.
* **Tech**: Flat JSON + Local Image Assets.
* **Function**: Acts as a local "database" to ensure the site remains blazing fast and doesn't hit API rate limits or external dependencies during page loads.

### 3. [The Visual Interface (`/src`)](./src/README.md)

* **Role**: Presentation & UX.
* **Tech**: Next.js 15 (App Router) + Tailwind CSS + Framer Motion.
* **Function**: Consumes the local JSON to render a responsive Bento Grid. Features activity-based sorting and a custom Plexus particle background.

---

## 🔄 The Interaction Loop

1. **Event**: A nightly cron job or a manual push triggers the `Sync Data` workflow.
2. **Process**: The Python script updates `projects.json` and downloads new `thumb.png` files to `/assets`.
3. **Commit**: GitHub Actions commits these changes back to the `master` branch.
4. **React**: The `Deploy` workflow detects changes in `/data` or `/assets` and triggers a fresh Next.js static export.
5. **Serve**: The updated site is pushed to GitHub Pages.

---

## 🚀 Quick Start for Devs

```bash
# 1. Clone the stack
git clone https://github.com/gonzabenitez/gonzabenitez.github.io.git

# 2. Run the automation (requires GITHUB_PAT)
uv run scripts/sync-projects.py

# 3. Launch the UI
cd src
npm install && npm run dev

```

---

## 📈 Key Automation Features

* **Smart Refresh**: Thumbnails are only re-captured if the repository `pushed_at` date is newer than the local asset.
* **Force-Dark Design**: Hardcoded CSS variables to ensure visual consistency regardless of OS theme settings.
* **Plexus Network**: A custom `Canvas` implementation in the Hero section symbolizing interconnected automated systems.

---
