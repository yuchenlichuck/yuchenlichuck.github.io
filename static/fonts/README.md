# Site fonts

Latin WOFF2 files are the unmodified Latin responses from Google Fonts for IBM
Plex Sans (400/500/600), IBM Plex Mono (400/500), Source Serif 4 (500/600/700),
and Syne (600/700/800). These families use the SIL Open Font License 1.1; the
upstream copyright notices and licenses are included as `LICENSE-*.txt`.

Noto Sans SC was subset from Google's full variable
[`NotoSansSC[wght].ttf`](https://github.com/google/fonts/tree/main/ofl/notosanssc)
using FontTools `pyftsubset` with WOFF2/Brotli, all layout features, no hinting,
and the original 100–900 weight axis. The local CSS family is `Noto Sans SC Site`.
The disjoint chunks cover initial Home text, additional JS/Neko text, and the
remaining built content. Their CSS unicode ranges match their cmaps exactly.
The original Google Noto Sans SC CSS loads asynchronously, unchanged, as the
fallback after the local family for uncovered characters and dynamic CJK.
Shared pages also retain Google's original Noto Serif SC 600 fallback.

Font Awesome Free 6.5.1 and Academicons 1.8.6 came from cdnjs. Their original CSS
is retained in `../css/site-icons.css`, with only font `src` declarations changed.
Icon fonts are WOFF2 subsets preserving codepoints and names. The inventory
included built HTML, templates, content, data, and static/assets JS strings.

- [Font Awesome Free license](https://fontawesome.com/license/free): fonts OFL
  1.1, code MIT, icons CC BY 4.0; see `LICENSE-Font-Awesome.txt`.
- [Academicons 1.8.6](https://github.com/jpswalsh/academicons/tree/v1.8.6), by
  James Walsh: font OFL 1.1; CSS MIT, as stated in its upstream README. The OFL
  1.1 terms are also reproduced in the included font licenses.

Generation used one-off browser inventories and FontTools scripts, not a
standalone reusable generator; no regeneration script is shipped. To update,
rebuild Hugo, refresh rendered-text and source-string inventories, then run
`pyftsubset SOURCE --unicodes=U+... --flavor=woff2 --layout-features=* --no-hinting`.
Preserve the variable axis, prune cmap aliases to the assigned disjoint ranges,
and repeat font/icon and screenshot checks. Leave the Google fallback CSS unchanged.
Do not regenerate Latin files by subsetting: copy the matching Google response.
