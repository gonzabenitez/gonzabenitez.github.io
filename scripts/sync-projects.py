#!/usr/bin/env -S uv run
# /// script
# dependencies = [
#   "PyGithub",
#   "python-dotenv",
# ]
# ///

# --- PATH CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Next.js imports JSON from here
OUTPUT_DATA_PATH = os.path.join(BASE_DIR, "src", "data", "projects.json")

# Python saves images here
LOCAL_ASSET_DIR = os.path.join(BASE_DIR, "src", "public", "assets")


import os
import json
import uuid
from datetime import datetime
from github import Github, GithubException
from dotenv import load_dotenv
import requests
import base64

# --- CONFIGURATION ---
load_dotenv()
GITHUB_PAT = os.getenv("GITHUB_PAT")
GITHUB_USERNAME = "gonzabenitez"
PORTFOLIO_REPO_NAME = "gonzabenitez/gonzabenitez.github.io"
MANUAL_DATA_PATH = "data/manual-projects.json"
OUTPUT_DATA_PATH = "data/projects.json"
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

def main():
    if not GITHUB_PAT:
        print("❌ Error: GITHUB_PAT not found.")
        return

    gh = Github(GITHUB_PAT)
    user = gh.get_user(GITHUB_USERNAME)
    portfolio_repo = gh.get_repo(PORTFOLIO_REPO_NAME)
    
    # 1. Fetch GitHub Repos
    print(f"📡 Fetching repos for {GITHUB_USERNAME}...")
    github_projects = []
    for repo in user.get_repos():
        
        
        print(f"  > Processing: {repo.name}")
# --- THE BULLETPROOF DEMO DISCOVERY ---
        demo_url = repo.homepage # Tier 1: Manual "Homepage" field
        
        if not demo_url:
            try:
                # Tier 2: Official Pages API
                pages_info = repo.get_pages()
                demo_url = pages_info.html_url
                print(f"    ✨ Found via Pages API: {demo_url}")
            except Exception:
                # Tier 3: The "CNAME" Fallback (The Source of Truth)
                try:
                    cname_file = repo.get_contents("CNAME")
                    domain = cname_file.decoded_content.decode("utf-8").strip()
                    demo_url = f"https://{domain}"
                    print(f"    🔗 Found via CNAME file: {demo_url}")
                except Exception:
                    demo_url = "" # Truly no live link found
        screenshots, thumb, thumb_date = get_assets(portfolio_repo, repo.name)
        
        # Determine if we need a refresh
        is_stale = not thumb_date or repo.pushed_at > thumb_date
        #is_stale = True #uncomment to force thumbnail refresh
        
        if is_stale and demo_url:
            print(f"    🔄 Refreshing thumbnail for {repo.name}...")
            
            # Request fresh screenshot from Microlink
            api_url = f"https://api.microlink.io/?url={demo_url}&screenshot=true&embed=screenshot.url"
            
            # Push it to your repo!
            asset_path = f"assets/{repo.name}/thumb.png"
            update_repo_file(asset_path, api_url)
            
            # Update the thumb variable for the JSON output
            thumb = f"https://raw.githubusercontent.com/{PORTFOLIO_REPO_NAME}/master/{asset_path}"

        # Get all topics and the primary language
        topics = repo.get_topics()
        primary_lang = repo.language

        # Merge topics + language, filter out None, and make unique
        all_tags = list(set(filter(None, topics + ([primary_lang] if primary_lang else []))))
        
        # Check if "featured" is in topics
        is_featured = "featured" in topics

        github_projects.append({
            "id": f"gh-{repo.id}",
            "title": repo.name.replace("-", " ").replace("_", " ").title(),
            "description": repo.description or "",
            "content": get_readme_content(repo),
            "thumbnail": f"/assets/{repo.name}/thumb.png",
            "images": screenshots,
            "url": repo.html_url,
            "demo": demo_url or "",
            "tags": all_tags,
            "date": repo.created_at.isoformat(),
            "last_pushed": repo.pushed_at.isoformat(),
            "source": "github",
            "is_fork": repo.fork,
            "is_featured":is_featured
        })

    # 2. Load Manual Projects
    manual_projects = []
    if os.path.exists(MANUAL_DATA_PATH):
        with open(MANUAL_DATA_PATH, 'r') as f:
            manual_projects = json.load(f)
            # Ensure they have a 'source' tag for the UI
            for p in manual_projects: p["source"] = p.get("source", "manual")

    # 3. Merge and Save
    all_projects = manual_projects + github_projects
    # Sort by date descending
    all_projects.sort(key=lambda x: x.get('date', ''), reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_DATA_PATH), exist_ok=True)
    with open(OUTPUT_DATA_PATH, 'w') as f:
        json.dump(all_projects, f, indent=2)
    
    print(f"✅ Success! {len(all_projects)} projects synced to {OUTPUT_DATA_PATH}")

def update_repo_file(repo_name, image_url):
    """Saves the image into the Next.js public folder."""
    try:
        # Physical path on disk for the script to write
        target_dir = os.path.join(LOCAL_ASSET_DIR, repo_name)
        os.makedirs(target_dir, exist_ok=True)
        
        path = os.path.join(target_dir, "thumb.png")
        img_data = requests.get(image_url).content
        with open(path, "wb") as f:
            f.write(img_data)
        print(f"    ✅ Asset saved: src/public/assets/{repo_name}/thumb.png")
    except Exception as e:
        print(f"    ❌ Asset save failed: {e}")



if __name__ == "__main__":
    main()