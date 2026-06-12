#!/usr/bin/env python3
"""
Utility script to update a CSV table of publications with
up-to-date GitHub stars badges and Google Scholar citation badges.

Inspired by Google_Scholar_Badge_Generator:
https://github.com/WenjieDu/Google_Scholar_Badge_Generator/tree/main
"""

from __future__ import annotations

import csv
import os
from pathlib import Path

import gsbg  # Google Scholar Badge Generator
import requests  # type: ignore
import cairosvg  # type: ignore

ROOT = Path(__file__).resolve().parent
# Source-of-truth CSV exposed on the website for download.
CSV_PATH = ROOT / "static" / "files" / "publications.csv"
# Directory in the website where we cache rendered badge PNGs.
BADGE_DIR = ROOT / "static" / "img" / "pub"


def github_stars_badge(repo: str) -> str:
    """Return shields.io URL for GitHub stars badge (SVG)."""
    if not repo:
        return ""
    return f"https://img.shields.io/github/stars/{repo}?style=social"


def fetch_github_stars_count(repo: str, fallback: str | int | None) -> str:
    """
    Fetch numeric GitHub stars from the GitHub REST API, or fall back.

    Equivalent to:
    `curl https://api.github.com/repos/{owner}/{repo} | grep 'stargazers_count'`
    """
    if not repo:
        return str(fallback or "")

    owner_repo = repo.strip()
    url = f"https://api.github.com/repos/{owner_repo}"

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "update_cites-script",
    }
    token = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        value = data.get("stargazers_count")
        if value is None:
            return str(fallback or "")
        return str(value)
    except Exception:
        return str(fallback or "")


def fetch_google_cites(link: str, fallback: str | int | None) -> str:
    """
    Fetch latest citation count from Google Scholar using gsbg when possible,
    otherwise fall back to the stored/frontmatter value.
    """
    if gsbg is not None and link:
        try:
            return str(gsbg.fetch_article_citation_num(link))
        except Exception:
            # Fallback to frontmatter/CSV value if network or parsing fails.
            pass
    return str(fallback or "")


def main() -> None:
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    BADGE_DIR.mkdir(parents=True, exist_ok=True)

    if not CSV_PATH.exists():
        raise SystemExit(f"CSV not found: {CSV_PATH}")

    # Copy Google Scholar logo into pub/ for convenience (if present).
    logo_src = ROOT / "static" / "img" / "Google_Scholar_logo.png"
    if logo_src.exists():
        (BADGE_DIR / logo_src.name).write_bytes(logo_src.read_bytes())

    rows: list[dict[str, str]] = []
    with CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        # Ensure our derived columns are present.
        for extra in ("github_stars", "github_stars_badge_local", "google_scholar_badge_local_flat", "github_stars_badge_local_flat"):
            if extra not in fieldnames:
                fieldnames.append(extra)

        for row in reader:
            slug = row.get("slug", "").strip()
            if not slug:
                continue

            github_repo = (row.get("github_repo") or "").strip()
            scholar_link = (row.get("google_scholar_link") or "").strip()
            prev_cites = row.get("google_scholar_cites") or ""
            prev_stars = row.get("github_stars") or ""

            # Refresh citations if a Google Scholar link is provided.
            cites_value = fetch_google_cites(scholar_link, prev_cites)

            # GitHub stars badge URL and numeric count.
            stars_count = fetch_github_stars_count(github_repo, prev_stars)
            stars_url = github_stars_badge(github_repo) if github_repo else (row.get("github_stars_badge") or "")

            # Build shields.io URL for Google Scholar cites badge.
            badge_url = row.get("google_scholar_badge_url") or ""
            badge_local = row.get("google_scholar_badge_local") or ""
            badge_local_flat = row.get("google_scholar_badge_local_flat") or ""
            # Only generate/save cites badge if cites >= 100.
            try:
                cites_int = int(cites_value)
            except (TypeError, ValueError):
                cites_int = 0
            if cites_int >= 100:
                badge_url = (
                    f"https://img.shields.io/badge/Cites-{cites_value}-white"
                    f"?style=social&logo=googlescholar&color=blue"
                )
                # Download SVG and render a high-res PNG for LaTeX (social style).
                svg_url = (
                    f"https://img.shields.io/badge/Cites-{cites_value}-white.svg"
                    f"?style=social&logo=googlescholar&color=blue"
                )
                resp = requests.get(svg_url, timeout=10)
                resp.raise_for_status()
                local_name = f"{slug}_cites.png"
                svg_bytes = resp.content
                png_bytes = cairosvg.svg2png(bytestring=svg_bytes, output_height=512)
                (BADGE_DIR / local_name).write_bytes(png_bytes)
                badge_local = f"/img/pub/{local_name}"
                
                # Also download flat style version.
                svg_url_flat = (
                    f"https://img.shields.io/badge/{cites_value}-{cites_value}.svg"
                    f"?style=flat&logo=googlescholar&color=white"
                )
                resp = requests.get(svg_url_flat, timeout=10)
                resp.raise_for_status()
                local_name_flat = f"{slug}_cites_flat.png"
                svg_bytes = resp.content
                png_bytes = cairosvg.svg2png(bytestring=svg_bytes, output_height=512)
                (BADGE_DIR / local_name_flat).write_bytes(png_bytes)
                badge_local_flat = f"/img/pub/{local_name_flat}"

            # Download GitHub stars badge PNG as well (for LaTeX), if repo exists and stars >= 100.
            stars_local = row.get("github_stars_badge_local") or ""
            stars_local_flat = row.get("github_stars_badge_local_flat") or ""
            try:
                stars_int = int(stars_count)
            except (TypeError, ValueError):
                stars_int = 0
            if github_repo and stars_url and stars_int >= 100:
                # Download social style badge.
                svg_url = stars_url.replace("?style=social", ".svg?style=social")
                resp = requests.get(svg_url, timeout=10)
                resp.raise_for_status()
                local_name = f"{slug}_stars.png"
                svg_bytes = resp.content
                png_bytes = cairosvg.svg2png(bytestring=svg_bytes, output_height=512)
                (BADGE_DIR / local_name).write_bytes(png_bytes)
                stars_local = f"/img/pub/{local_name}"
                
                # Also download flat style version.
                svg_url_flat = (
                    f"https://img.shields.io/badge/{stars_count}-{stars_count}.svg"
                    f"?style=flat&logo=github&color=black"
                )
                resp = requests.get(svg_url_flat, timeout=10)
                resp.raise_for_status()
                local_name_flat = f"{slug}_stars_flat.png"
                svg_bytes = resp.content
                png_bytes = cairosvg.svg2png(bytestring=svg_bytes, output_height=512)
                (BADGE_DIR / local_name_flat).write_bytes(png_bytes)
                stars_local_flat = f"/img/pub/{local_name_flat}"


            # Update row fields.
            row["github_stars"] = str(stars_count or "")
            row["github_stars_badge"] = stars_url
            row["google_scholar_cites"] = str(cites_value or "")
            row["google_scholar_badge_url"] = badge_url
            row["google_scholar_badge_local"] = badge_local
            row["google_scholar_badge_local_flat"] = badge_local_flat
            row["github_stars_badge_local"] = stars_local
            row["github_stars_badge_local_flat"] = stars_local_flat

            # Console summary for this publication.
            title = (row.get("title") or "").strip()
            short_title = title if len(title) <= 60 else title[:57] + "..."
            print(f"[{slug}] {short_title}")
            print(f"  Cites: {row['google_scholar_cites'] or 'N/A'}"
                  f" | GitHub stars: {row['github_stars'] or 'N/A'}")

            rows.append(row)

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()


