"""Cache public repository activity; never contact GitHub from visitors' browsers."""
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError
import json
import os
import re

REPOSITORIES = ["keyaura", "cad-mouse-mk2", "cad-mouse-mk2-companion-app", "services", "kohai"]
DESTINATION = Path(__file__).resolve().parents[1] / "assets/repositories.json"

def get(path):
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "jonathanlaf-portfolio", "X-GitHub-Api-Version": "2022-11-28"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = "Bearer " + token
    with urlopen(Request("https://api.github.com" + path, headers=headers), timeout=30) as response:
        return json.load(response), response.headers.get("Link", "")

def pages(path):
    url = path + ("&" if "?" in path else "?") + "per_page=100"
    for _ in range(100):
        data, links = get(url)
        if not isinstance(data, list):
            raise ValueError("Expected a public list")
        yield from data
        match = re.search(r'<https://api.github.com([^>]+)>; rel="next"', links)
        if not match:
            return
        url = match.group(1)
    raise ValueError("Pagination limit reached; preserve the previous snapshot")

def main():
    now = datetime.now(timezone.utc).replace(microsecond=0)
    since = now - timedelta(days=30)
    result = {"updated": now.isoformat(), "since": since.isoformat(), "repositories": {}}
    for name in REPOSITORIES:
        path = "/repos/jonathanlaf/" + name
        metadata, _ = get(path)
        query = urlencode({"sha": metadata["default_branch"], "since": since.isoformat(), "until": now.isoformat()})
        try:
            commits = sum(1 for _ in pages(path + "/commits?" + query))
        except HTTPError as error:
            if error.code != 409:
                raise
            commits = 0
        releases = [r for r in pages(path + "/releases") if not r.get("draft")]
        downloads = sum(asset["download_count"] for release in releases for asset in release.get("assets", []))
        result["repositories"][name] = {"commits30days": commits, "downloads": downloads,
            "releases": len(releases), "branch": metadata["default_branch"]}
    # Only replace the snapshot after every public repository succeeded.
    destination = DESTINATION.with_suffix(".tmp")
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    destination.replace(DESTINATION)
    print("Updated public statistics for", len(REPOSITORIES), "repositories")

if __name__ == "__main__":
    main()
