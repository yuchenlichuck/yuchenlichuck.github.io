+++
title = "PointNeXt: Revisiting PointNet++ with Improved Training and Scaling Strategies"
date = 2022-10-01T00:00:00
draft = false
authors = ["__**Yuchen Li***__", "Guocheng Qian*", "Houwen Peng", "Jinjie Mai", "Hasan Abed Al Kader Hammoud", "Mohamed Elhoseiny", "Bernard Ghanem"]
publication_types = ["1"]
publication = "Conference on Neural Information Processing Systems, 2022"
publication_short = "*NeurIPS'22*"
abstract = """PointNet++ is one of the most influential neural architectures for point cloud understanding. Although its accuracy has been surpassed by recent networks such as PointMLP and Point Transformer, we find that much of the performance gain comes from improved training strategies, data augmentation, optimization techniques, and increased model sizes rather than architectural innovations alone. We revisit PointNet++ through a systematic study of training and scaling strategies. First, we propose improved training strategies that significantly boost PointNet++ performance, raising overall accuracy on ScanObjectNN from 77.9% to 86.1% without architectural changes. Second, we introduce an inverted residual bottleneck design and separable MLPs into PointNet++ to enable efficient scaling, yielding PointNeXt. PointNeXt can be flexibly scaled and achieves strong results on 3D classification and segmentation tasks."""
abstract_short = "PointNeXt revisits PointNet++ with improved training and scaling strategies for point-cloud understanding."
selected = true
featured = true
projects = []
slides = ""
tags = ["Point Cloud", "3D Vision", "Representation Learning"]
url_preprint = "https://arxiv.org/abs/2206.04670"
url_code = "https://github.com/guochengqian/pointnext"
math = false

[image]
  focal_point = "Center"
  placement = 2
+++
