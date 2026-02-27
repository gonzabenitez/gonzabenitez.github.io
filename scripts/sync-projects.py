#!/usr/bin/env -S uv run
# /// script
# dependencies = [
#   "PyGithub",
#   "python-dotenv",
#   "requests",
# ]
# ///

import os
import json
import uuid
import requests
import base64
from datetime import datetime
from github import Github, GithubException
from dotenv import load_dotenv


load_dotenv()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Next.js serves from 'public', so we save data and assets there
# This ensures the frontend fetch('/data/projects.json') finds it.
OUTPUT_DATA_PATH = os.path.join(BASE_DIR, "src", "public", "data", "projects.json")
LOCAL_ASSET_DIR = os.path.join(BASE_DIR, "src", "public", "assets")
MANUAL_DATA_PATH = os.path.join(BASE_DIR, "data", "manual-projects.json")

# --- CONFIGURATION ---
GITHUB_PAT = os.getenv("GITHUB_PAT")
GITHUB_USERNAME = "gonzabenitez"
PORTFOLIO_REPO_NAME = "gonzabenitez/gonzabenitez.github.io"
GENERIC_THUMB = "/assets/fallback-thumb.png"

def get_readme_content(repo):
    try:
        return repo.get_readme().decoded_content.decode("utf-8")
    except:
        return repo.description or ""

def get_assets(portfolio_repo, repo_name):
    """Returns screenshots, thumbnail URL, and the date the thumbnail was last updated."""
    screenshots = []
    thumbnail = GENERIC_THUMB
    thumb_updated_at = None
    folder = f"assets/{repo_name}"

    try:
        contents = portfolio_repo.get_contents(folder)
        for item in contents:
            if item.type == "file" and item.name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                screenshots.append(item.download_url)
                if "thumb" in item.name.lower():
                    thumbnail = item.download_url
                    # This gets the last commit date for this specific file
                    commits = portfolio_repo.get_commits(path=item.path)
                    if commits.totalCount > 0:
                        thumb_updated_at = commits[0].commit.committer.date

        if screenshots and thumbnail == GENERIC_THUMB:
            thumbnail = screenshots[0]
    except GithubException:
        pass 
    
    return sorted(screenshots), thumbnail, thumb_updated_at

def update_repo_file(repo_name, image_url):
    """Saves the image into the Next.js public folder."""
    try:
        # We use repo_name as the subfolder
        target_dir = os.path.join(LOCAL_ASSET_DIR, repo_name)
        os.makedirs(target_dir, exist_ok=True)
        
        path = os.path.join(target_dir, "thumb.png")
        img_data = requests.get(image_url).content
        with open(path, "wb") as f:
            f.write(img_data)
        print(f"    ✅ Asset saved locally: {path}")
    except Exception as e:
        print(f"    ❌ Asset save failed: {e}")

def main():
    if not GITHUB_PAT:
        print("❌ Error: GITHUB_PAT not found.")
        return

    gh = Github(GITHUB_PAT)
    user = gh.get_user(GITHUB_USERNAME)
    # Note: We are writing LOCALLY to the filesystem now, 
    # then GitHub Actions will commit those files for us.
    
    print(f"📡 Fetching repos for {GITHUB_USERNAME}...")
    github_projects = []
    
    for repo in user.get_repos():
        print(f"  > Processing: {repo.name}")
        
        # --- Demo Discovery Logic ---
        demo_url = repo.homepage
        if not demo_url:
            try:
                demo_url = repo.get_pages().html_url
            except:
                try:
                    cname_file = repo.get_contents("CNAME")
                    demo_url = f"https://{cname_file.decoded_content.decode('utf-8').strip()}"
                except:
                    demo_url = ""

        # Check for existing assets to see if we need a refresh
        # (Using your existing get_assets logic or a simple local check)
        asset_path = os.path.join(LOCAL_ASSET_DIR, repo.name, "thumb.png")
        is_stale = not os.path.exists(asset_path) 
        
        # If you want to keep the "pushed_at" check, you'll need thumb_date
        # For now, let's just make sure the file exists.
        
        if is_stale and demo_url:
            print(f"    🔄 Refreshing thumbnail for {repo.name}...")
            api_url = f"https://api.microlink.io/?url={demo_url}&screenshot=true&embed=screenshot.url"
            update_repo_file(repo.name, api_url)

        topics = repo.get_topics()
        github_projects.append({
            "id": f"gh-{repo.id}",
            "title": repo.name.replace("-", " ").replace("_", " ").title(),
            "description": repo.description or "",
            "content": get_readme_content(repo),
            "thumbnail": f"/assets/{repo.name}/thumb.png", # Relative web path
            "url": repo.html_url,
            "demo": demo_url,
            "tags": list(set(filter(None, topics + ([repo.language] if repo.language else [])))),
            "date": repo.created_at.isoformat(),
            "last_pushed": repo.pushed_at.isoformat(),
            "source": "github",
            "is_featured": "featured" in topics
        })

    # Merge with manual data
    manual_projects = []
    if os.path.exists(MANUAL_DATA_PATH):
        with open(MANUAL_DATA_PATH, 'r') as f:
            manual_projects = json.load(f)

    all_projects = manual_projects + github_projects
    all_projects.sort(key=lambda x: x.get('last_pushed', x.get('date', '')), reverse=True)

    # Final Save
    os.makedirs(os.path.dirname(OUTPUT_DATA_PATH), exist_ok=True)
    with open(OUTPUT_DATA_PATH, 'w') as f:
        json.dump(all_projects, f, indent=2)
    
    print(f"✅ Success! {len(all_projects)} projects synced to {OUTPUT_DATA_PATH}")

if __name__ == "__main__":
    main()