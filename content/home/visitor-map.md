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
  <script type="text/javascript" id="mapmyvisitors" src="//mapmyvisitors.com/map.js?d=QPxs_-R5BqEWih0nTgJXCXOsEyYiKnmZrrJKz8EHn3Q&cl=ffffff&w=a"></script>
</div>

<style>
  .visitor-map-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
