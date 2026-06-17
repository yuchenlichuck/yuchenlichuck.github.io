+++
# A Demo section created with the Blank widget.
# Any elements can be added in the body: https://sourcethemes.com/academic/docs/writing-markdown-latex/
# Add more sections by duplicating this file and customizing to your requirements.

widget = "blank"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = false  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 95  # Order that this section will appear.

title = "Public Coverage"
subtitle = ""

[design]
  # Choose how many columns the section has. Valid values: 1 or 2.
  columns = "1"

[design.background]
  # Apply a background color, gradient, or image.
  #   Uncomment (by removing `#`) an option to apply it.
  #   Choose a light or dark text color by setting `text_color_light`.
  #   Any HTML color name or Hex value is valid.

  # Background color.
  # color = "navy"
  
  # Background gradient.
  # gradient_start = "DarkGreen"
  # gradient_end = "ForestGreen"
  
  # Background image.
  # image = "image.jpg"  # Name of image in `static/img/`.
  # image_darken = 0.6  # Darken the image? Range 0-1 where 0 is transparent and 1 is opaque.

  # Text color (true=light or false=dark).
  # text_color_light = true

[design.spacing]
  # Customize the section spacing. Order is top, right, bottom, left.
  padding = ["20px", "0", "20px", "0"]

[advanced]
 # Custom CSS. 
 css_style = ""
 
 # CSS class.
 css_class = ""
+++
<style>
  .media-coverage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    margin: 0.75rem 0 1.5rem;
  }

  .media-coverage-card {
    display: flex;
    min-height: 165px;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  }

  .media-coverage-card:hover {
    transform: translateY(-2px);
    transition: transform 160ms ease;
  }

  body.theme-claude .media-coverage-meta {
    margin-bottom: 0.45rem;
    color: #6b7280;
    font-size: 0.82rem;
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }

  body.theme-claude .media-coverage-title {
    margin: 0 0 0.6rem;
    color: #111827;
    font-size: 1rem;
    line-height: 1.45;
  }

  body.theme-claude .media-coverage-summary {
    margin: 0;
    color: #4b5563;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  body.theme-claude .media-coverage-link {
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .media-video-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 0.75rem;
  }

  .media-video-frame {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
    border-radius: 8px;
    background: #f3f4f6;
  }

  @media (max-width: 720px) {
    .media-video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

### Public Coverage

<div class="media-coverage-grid">
  <article class="media-coverage-card">
    <div>
      <div class="media-coverage-meta">36Kr Europe · Jun 12, 2025</div>
      <h4 class="media-coverage-title">72小时全程纪实：人类首度与AI亲密接触</h4>
      <p class="media-coverage-summary">Featured in 36Kr Europe's documentary coverage of a 72-hour AI survival challenge, discussing AI agents, AI video creation, and human-AI interaction.</p>
    </div>
    <a class="media-coverage-link" href="https://eu.36kr.com/zh/p/3333024150333961" target="_blank" rel="noopener">Read article</a>
  </article>

  <article class="media-coverage-card">
    <div>
      <div class="media-coverage-meta">Next Capital · Jan 2024</div>
      <h4 class="media-coverage-title">迪拜商业英才李禹陈：浅谈中东2030愿景</h4>
      <p class="media-coverage-summary">Invited by Next Capital to share perspectives on the Middle East 2030 vision and opportunities for Chinese founders in the region.</p>
    </div>
    <a class="media-coverage-link" href="https://www.jiachengcap.com/blog/240105_56c8" target="_blank" rel="noopener">Read article</a>
  </article>

  <article class="media-coverage-card">
    <div>
      <div class="media-coverage-meta">Xiaoyuzhou · Podcast</div>
      <h4 class="media-coverage-title">07. 去中东上学：全靠酋长资助，不用交学费，还赚钱！</h4>
      <p class="media-coverage-summary">Guest appearance on 掘金中东, covering KAUST, MBZUAI, Dubai Business Associates, Middle East universities, and life across the region.</p>
    </div>
    <a class="media-coverage-link" href="https://www.xiaoyuzhoufm.com/episode/6641cf18f968fce2cbbccdfc" target="_blank" rel="noopener">Listen episode</a>
  </article>
</div>

### Video Interviews

<div class="media-video-grid">
  <iframe class="media-video-frame" src="https://player.bilibili.com/player.html?bvid=BV1jL411G7HL&page=1&high_quality=1&autoplay=0" loading="lazy" allowfullscreen="true" scrolling="no"></iframe>
  <iframe class="media-video-frame" src="https://player.bilibili.com/player.html?isOutside=true&aid=793300345&bvid=BV1zC4y1e7ab&cid=1396155520&p=1&autoplay=0" loading="lazy" allowfullscreen="true" scrolling="no"></iframe>
  <iframe class="media-video-frame" src="https://player.bilibili.com/player.html?isOutside=true&aid=114919685031435&bvid=BV1728bzzEym&cid=31298225202&p=1&autoplay=0" loading="lazy" allowfullscreen="true" scrolling="no"></iframe>
  <iframe class="media-video-frame" src="https://player.bilibili.com/player.html?isOutside=true&aid=114850344801356&bvid=BV1uguizREY3&cid=31030183754&p=1&autoplay=0" loading="lazy" allowfullscreen="true" scrolling="no"></iframe>
</div>
