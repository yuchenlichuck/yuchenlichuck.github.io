#!/usr/bin/env python3
"""Refresh data/scholar.json from the public Google Scholar profile.

Runs in CI before `hugo --minify` (weekly schedule + every push). It is
best-effort: Scholar often answers bots with a captcha, so on any failure the
script leaves the committed numbers untouched and exits 0. Standard library only.
"""
import datetime
import html
import json
import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "scholar.json"

# Paper keys used by the site -> distinctive words from the Scholar title.
TITLES = {
    "pointnext": "pointnext",
    "compatpp": "3dcompat++",
    "compat": "3dcompat: composition of materials",
    "fewshot": "few-shot 3d point cloud",
    "perceptio": "perceptio",
}


def log(msg):
    print(f"[scholar] {msg}")


def fetch(user):
    url = f"https://scholar.google.com/citations?user={user}&hl=en&cstart=0&pagesize=100"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    })
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace")


def parse(page):
    # Totals table: Citations / h-index / i10-index, "All" column first.
    totals = [int(x) for x in re.findall(r'<td class="gsc_rsb_std">(\d+)</td>', page)]
    if len(totals) < 6:
        raise ValueError("totals table not found (captcha or layout change)")
    out = {"citations": totals[0], "h_index": totals[2], "i10_index": totals[4], "papers": {}}
    for row in re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', page, re.S):
        t = re.search(r'class="gsc_a_at"[^>]*>(.*?)</a>', row, re.S)
        c = re.search(r'class="gsc_a_ac gs_ibl"[^>]*>(\d*)</a>', row)
        if not t:
            continue
        title = html.unescape(re.sub(r"<[^>]+>", "", t.group(1))).lower()
        cites = int(c.group(1)) if c and c.group(1) else 0
        for key, needle in TITLES.items():
            if needle in title and cites >= out["papers"].get(key, 0):
                out["papers"][key] = cites
    return out


def main():
    old = json.loads(DATA.read_text())
    try:
        new = parse(fetch(old["profile"]))
    except Exception as e:  # network, captcha, parsing
        log(f"kept committed numbers ({e})")
        return 0
    # Sanity: citation counts only grow; a big drop means we parsed the wrong page.
    if new["citations"] < old["citations"] * 0.9 or "pointnext" not in new["papers"]:
        log(f"implausible result {new['citations']} vs {old['citations']}; kept committed numbers")
        return 0
    papers = dict(old.get("papers", {}))
    papers.update({k: v for k, v in new["papers"].items() if v})  # Scholar leaves 0 blank
    old.update({k: new[k] for k in ("citations", "h_index", "i10_index")})
    old["papers"] = papers
    old["updated"] = datetime.date.today().isoformat()
    DATA.write_text(json.dumps(old, indent=2, ensure_ascii=False) + "\n")
    log(f"citations={old['citations']} h={old['h_index']} i10={old['i10_index']} papers={papers}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
