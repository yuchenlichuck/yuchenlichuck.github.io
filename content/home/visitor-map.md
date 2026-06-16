+++
widget = "blank"
headless = false
active = true
weight = 130

title = "Visitor Map"
subtitle = ""

[design]
  columns = "1"

[design.spacing]
  padding = ["20px", "0", "20px", "0"]

[advanced]
  css_style = ""
  css_class = "visitor-map-section"
+++

<div class="visitor-map-wrapper">
  <iframe src="https://revolvermaps2.com/widget/ebf37178-9ec6-441b-95b0-771d414b1713" width="320" height="320" style="border:0;" loading="lazy"></iframe>
</div>

<style>
  .visitor-map-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
