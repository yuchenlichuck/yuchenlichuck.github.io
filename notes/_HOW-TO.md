# How to post on the blog · 怎么发博客

Files and folders starting with `_` (like this one) are never published.
以 `_` 开头的文件和文件夹（比如这个说明）不会被发布。

## The short version · 最简单的方式

1. Write your text in any Markdown/text editor. The first line `# Title` becomes the title.
   用任何编辑器写一个 Markdown 文件，第一行 `# 标题` 就是文章标题。
2. Name the file with the date first: `2026-10-13-anything.md`, and put it in this `notes/` folder
   (on GitHub: open the `notes` folder → **Add file → Upload files** → Commit).
   文件名以日期开头，例如 `2026-10-13-anything.md`，放进 `notes/` 文件夹
   （在 GitHub 网页上：进入 `notes` 文件夹 → **Add file → Upload files** → Commit 即可，手机也能操作）。
3. That's it. The site rebuilds in ~2 minutes and the post appears at liyc.pw/post/ (and /zh/post/).
   就这样。大约 2 分钟后网站自动更新，文章会出现在 liyc.pw/post/ 和 /zh/post/。

Or just send the text (and photos) to Claude and ask for it to be posted. · 或者直接把文字和照片发给 Claude 帮你发。

## With photos · 带照片

Use a folder instead of a single file, and put the photos next to the text:
用文件夹代替单个文件，照片放在同一个文件夹里：

```
notes/2026-10-13-heidelberg-laureate-forum/
  index.zh.md        ← 中文原文 (Chinese site)
  index.en.md        ← English translation (English site) — optional · 可选
  featured.jpg       ← cover image for the blog list · 列表封面图（可选）
  hlf-1.jpg
```

In the text: `![a short description](hlf-1.jpg)` · 正文里插图：`![图片说明](hlf-1.jpg)`

If you only write `index.md` (one language), the same post is shown on both sites; the English site
marks a Chinese post "In Chinese". · 只写一个 `index.md` 时，中英文站都会显示同一篇，英文站会标注“In Chinese”。

## Optional settings at the top · 可选的开头设置

```
---
title: 自定义标题 / custom title
date: 2026-10-13
summary: 列表里显示的一句话简介 / one-line summary for the list
tags: [Life, Travel]
categories: [Notes]        # or Research …
draft: true                # hide it for now · 暂不发布
---
```

Everything here is optional. · 以上都可以不写。
