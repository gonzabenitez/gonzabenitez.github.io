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
import requests
from github import Github, GithubException
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Next.js paths inside public
OUTPUT_DATA_PATH = os.path.join(BASE_DIR, "src", "public", "data", "projects.json")
LOCAL_ASSET_DIR = os.path.join(BASE_DIR, "src", "public", "assets")
MANUAL_DATA_PATH = os.path.join(BASE_DIR, "data", "manual-projects.json")

GITHUB_PAT = os.getenv("GITHUB_PAT")
GITHUB_USERNAME = "gonzabenitez"
PORTFOLIO_REPO_NAME = "gonzabenitez/gonzabenitez.github.io"

def get_assets_info(portfolio_repo, repo_name):
    """Fetches screenshots and the thumb's last update date from GitHub."""
    screenshots = []
    thumb_date = None
    folder = f"src/public/assets/{repo_name}" # The path as seen by Git

    try:
        contents = portfolio_repo.get_contents(folder)
        for item in contents:
            if item.type == "file" and item.name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                # The web URL for the Next.js frontend
                screenshots.append(f"/assets/{repo_name}/{item.name}")
                if "thumb" in item.name.lower():
                    commits = portfolio_repo.get_commits(path=item.path)
                    if commits.totalCount > 0:
                        thumb_date = commits[0].commit.committer.date
    except Exception:
        pass 
    return sorted(screenshots), thumb_date

def save_image_locally(repo_name, image_url):
    try:
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
    portfolio_repo = gh.get_repo(PORTFOLIO_REPO_NAME)
    
    github_projects = []
    
    for repo in user.get_repos():
    
            
        print(f"  > Processing: {repo.name}")
        
        # Get existing assets and the thumb's "Last Updated" date
        screenshots, thumb_date = get_assets_info(portfolio_repo, repo.name)
        
        # Check if the repo has new code since the last thumbnail
        is_stale = not thumb_date or repo.pushed_at > thumb_date
        
        demo_url = repo.homepage
        if not demo_url:
            try: demo_url = repo.get_pages().html_url
            except: demo_url = ""

        if is_stale and demo_url:
            print(f"    🔄 Refreshing thumbnail (Last push: {repo.pushed_at})")
            api_url = f"https://api.microlink.io/?url={demo_url}&screenshot=true&embed=screenshot.url"
            save_image_locally(repo.name, api_url)

        github_projects.append({
            "id": f"gh-{repo.id}",
            "title": "Portfolio" if repo.name == "gonzabenitez.github.io" else repo.name.replace("-", " ").replace("_", " ").title(),
            "description": repo.description or "",
            "thumbnail": f"/assets/{repo.name}/thumb.png",
            "images": screenshots, # Properly populated
            "url": repo.html_url,
            "demo": demo_url,
            "tags": list(set(filter(None, repo.get_topics() + ([repo.language] if repo.language else [])))),
            "date": repo.created_at.isoformat(),
            "last_pushed": repo.pushed_at.isoformat(),
            "source": "github",
            "is_featured": "featured" in repo.get_topics()
        })

    # Load Manual
    manual_projects = []
    if os.path.exists(MANUAL_DATA_PATH):
        with open(MANUAL_DATA_PATH, 'r') as f:
            manual_projects = json.load(f)

    all_projects = manual_projects + github_projects
    all_projects.sort(key=lambda x: x.get('last_pushed', x.get('date', '')), reverse=True)

    # Save to the public/data folder for the frontend fetch
    os.makedirs(os.path.dirname(OUTPUT_DATA_PATH), exist_ok=True)
    with open(OUTPUT_DATA_PATH, 'w') as f:
        json.dump(all_projects, f, indent=2)
    
    print(f"✅ Sync complete. {len(all_projects)} projects.")

if __name__ == "__main__":
    main()