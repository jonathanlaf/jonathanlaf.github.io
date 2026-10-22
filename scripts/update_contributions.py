"""Refresh only the contribution activity already visible on the public GitHub profile."""
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
import json
import re

SOURCE = "https://github.com/users/jonathanlaf/contributions"
DESTINATION = Path(__file__).resolve().parents[1] / "assets/contributions.json"

class Calendar(HTMLParser):
    def __init__(self):
        super().__init__()
        self.days = []
        self.tooltips = {}
        self.tooltip_id = None
        self.tooltip_text = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "td" and attrs.get("data-date") and attrs.get("data-level") in ("0", "1", "2", "3", "4"):
            self.days.append({"date": attrs["data-date"], "level": int(attrs["data-level"]), "id": attrs["id"]})
        if tag == "tool-tip":
            self.tooltip_id = attrs.get("for")
            self.tooltip_text = []
    def handle_data(self, data):
        if self.tooltip_id:
            self.tooltip_text.append(data)
    def handle_endtag(self, tag):
        if tag == "tool-tip" and self.tooltip_id:
            self.tooltips[self.tooltip_id] = "".join(self.tooltip_text).strip()
            self.tooltip_id = None

def main():
    request = Request(SOURCE, headers={"User-Agent": "jonathanlafleur-project-directory", "Accept": "text/html"})
    with urlopen(request, timeout=30) as response:
        html = response.read().decode("utf-8")
    calendar = Calendar()
    calendar.feed(html)
    days = []
    for day in sorted(calendar.days, key=lambda d: d["date"]):
        label = calendar.tooltips.get(day["id"], "")
        match = re.search(r"([0-9,]+) contributions? on", label, flags=re.I)
        if not match and not label.startswith("No contributions"):
            raise ValueError("Unrecognised public contribution tooltip; keeping the previous data.")
        days.append({"date": day["date"], "level": day["level"], "count": int(match.group(1).replace(",", "")) if match else 0})
    if not 350 <= len(days) <= 380 or len({d["date"] for d in days}) != len(days):
        raise ValueError("Incomplete public contribution calendar; keeping the previous data.")
    data = {"user": "jonathanlaf", "source": SOURCE, "updated": datetime.now(timezone.utc).date().isoformat(),
            "total": sum(d["count"] for d in days), "days": days}
    DESTINATION.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Updated {len(days)} days of public activity ({data['total']} contributions).")

if __name__ == "__main__":
    main()
