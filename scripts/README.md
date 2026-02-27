# ⚙️ Automation Engine

This directory contains the Python logic responsible for keeping the portfolio alive without manual intervention.

### Core Components
- **`sync-projects.py`**: 
  - Fetches all public repositories.
  - Resolves "Live Demos" via GitHub Pages, CNAME files, or repo homepages.
  - **Smart Refresh**: Checks the `pushed_at` date of a repo against the existing thumbnail's creation date. If the repo is newer, it triggers a re-shot.
  - **Asset Management**: Downloads screenshots locally to avoid Microlink quota burns on every page load.

### Setup
Run locally using `uv`:
```bash
uv run sync-projects.py