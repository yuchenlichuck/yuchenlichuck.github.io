# Yuchen Li · Personal Homepage ([liyc.pw](https://liyc.pw/))

Bilingual (English / 中文) academic homepage, blog, and verified press index built with [Hugo](https://gohugo.io/).

## Structure

- `config/_default/` — Hugo configuration, menus, and language settings (`/` for English, `/zh/` for Chinese)
- `content/authors/admin/` — Author profile, bio, highlights, and job-market callout (`_index.md` / `_index.zh.md`)
- `content/home/` — Homepage sections (About, Research, News, Publications, Experience, Beyond the Lab, Media & Talks, Service, Awards)
- `content/publication/` — Publication entries, teaser metadata, and `cite.bib` files
- `content/post/` & `notes/` — Blog posts and Markdown notes inbox (see [`notes/_HOW-TO.md`](notes/_HOW-TO.md))
- `data/` — Structured data for [`press.json`](data/press.json), [`scholar.json`](data/scholar.json), [`intro.yaml`](data/intro.yaml), and [`life.yaml`](data/life.yaml)
- `layouts/` & `assets/css/neural.css` — Custom templates, shortcodes, and theme styling

## Local Development

Requires **Hugo Extended ≥ 0.146** (CI uses `0.169.0`):

```bash
brew install hugo
./view.sh
```

## Updating Google Scholar Citations

Citation counts in `data/scholar.json` are refreshed automatically every Monday by GitHub Actions, or manually via:

```bash
python3 scripts/update_scholar.py
```
