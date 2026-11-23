---
title: "2027 年值得研究的计算机视觉方向"
subtitle: "博士收尾阶段的一次深度调研：七个方向的核心未解问题、与我自己工作的衔接点，以及对风险与算力门槛的坦率评估"
summary: "世界模型、空间推理 VLM、4D 生成、VLA 的视觉基础、统一理解-生成模型、高效视觉架构、视觉评测与可解释性。每个方向给出核心未解问题、可以入手的 arXiv 近期工作、与 Perceptio、UCanDance、PointNeXt 和 3D-CoMPaT 的衔接，以及风险和算力门槛。"
authors: [admin]
tags: [研究方向, 世界模型, 空间智能, VLM, 4D, VLA, 统一模型, 高效视觉, 评测, 调研]
categories: [Research]
date: 2026-11-08
draft: false
featured: false
image:
  caption: ""
  focal_point: ""
  preview_only: false
projects: []
---

博士即将毕业，我在认真考虑接下来做什么。为了把这个选择做好，我把大约一年半的 arXiv（2025 年 7 月到 2026 年 11 月初）过了一遍，对反复出现的每个方向都问同样四个问题：

1. **还有什么没解决？** 不是“什么最热”，而是哪些问题目前还没有令人信服的答案。
2. **从哪里开始读？** 每个方向挑几篇近期论文，加上它们所依赖的早期工作。
3. **我能带来什么？** 与我自己工作的衔接：[Perceptio](/zh/post/perceptio-spatial-tokens/)（空间 token VLM）、[UCanDance](/zh/publication/underreview2026dance/)（长时程音乐驱动舞蹈视频生成）、[PointNeXt](https://arxiv.org/abs/2206.04670) 与 [PointNets 缩放规律研究](/zh/publication/3dv2025pointnets/)（三维感知），以及 [3D-CoMPaT](https://www.ecva.net/papers/eccv_2022/papers_ECCV/html/3631_ECCV_2022_paper.php) / [3DCoMPaT++](https://arxiv.org/abs/2310.18511)（部件与材质级三维数据）。
4. **风险多大、要多少算力？** 这决定了一个小型学术团队、甚至一个人能不能做。

这篇文章是我整理过的工作笔记，希望对正在选题的同学也有帮助。

> **说明。** 文中引用的大多是近 16 个月的 arXiv 预印本，很多尚未经过同行评审，我只按其摘要中的表述来介绍。选题反映的是我的兴趣，而非整个领域。风险与算力评级是我个人的判断。

## 评级说明

**算力档位**（产出一篇有竞争力的论文大致需要的 GPU 预算，以 H100 级计）：

| 档位 | 预算 | 能做什么 |
|---|---|---|
| **A** | ≤ 8 卡，数周 | 基准、分析、探针、用 LoRA 微调 ≤ 8B 模型 |
| **B** | 8–64 卡 | 全量微调 7–8B VLM、训练前馈式 3D/4D 模型、视频模型后训练 |
| **C** | 64–512 卡 | 预训练中等规模视频或统一模型、大规模数据构建 |
| **D** | 1000+ 卡 | 前沿世界模型与基础模型，现实中基本只有工业界能做 |

**风险** 综合三点：*拥挤度*（被抢发的可能）、*评测稳定性*（需要的基准是否存在、是否可信）、*依赖性*（是否需要闭源模型、机器人硬件或拿不到的数据）。

## 总览

| # | 方向 | 一句话核心问题 | 与我工作的联系 | 风险 | 算力 |
|---|---|---|---|---|---|
| 1 | 世界模型与空间智能 | 把好看的视频变成*持久、一致、可交互*的状态 | UCanDance（长时程）、Perceptio（显式 3D 状态） | 高 | C–D（评测为 A–B） |
| 2 | 空间推理 VLM | 显式还是隐式几何？如何奖励空间推理？ | Perceptio，直接相关 | 中 | B |
| 3 | 4D 生成与动态场景重建 | 用野外视频训练一个既能重建又能生成动态场景的模型 | UCanDance、PointNeXt | 中 | B–C |
| 4 | 具身智能的视觉基础（VLA） | VLA 在动作训练中丢失空间感知 | Perceptio（深度 token）、3D-CoMPaT（部件） | 中–高 | B（仿真）/ C（真机） |
| 5 | 统一理解-生成模型 | 生成真的帮助理解吗？反之呢？ | Perceptio（把感知当作生成） | 高（拥挤） | C |
| 6 | 高效视觉架构 | 长视频与高分辨率，不付平方代价、不丢关键 token | PointNeXt（训练与缩放配方） | 低–中 | A–B |
| 7 | 视觉评测与可解释性 | 不看图就做不出的基准，以及可验证的机制解释 | Perceptio（可检查的 token）、3D-CoMPaT（组合式数据） | 低 | A |

---

## 1. 世界模型与空间智能

**为什么是现在。** 交互式视频世界模型已经从演示走向开源全栈。[Genie](https://arxiv.org/abs/2402.15391) 证明了可以从视频中学到可由动作控制的环境；[Cosmos](https://arxiv.org/abs/2501.03575) 发布了面向物理 AI 的世界基础模型平台；[Matrix-Game 2.0](https://arxiv.org/abs/2508.13009) 和 [minWM](https://arxiv.org/abs/2605.30263) 提供了实时、流式的开源流水线（数据构建、可控微调、自回归训练、少步蒸馏）。[Dreamer 4](https://arxiv.org/abs/2509.24527) 在 Minecraft 中直接*在学到的世界模型里*用强化学习训练智能体。全局视角可参考路线图 [Simulating the Visual World with Artificial Intelligence](https://arxiv.org/abs/2511.08585) 和综述 [3D and 4D World Modeling](https://arxiv.org/abs/2509.07996)。

**核心未解问题。**

- **持久状态与记忆。** 基于帧历史的模型会遗忘上下文窗口之外的内容。[PERSIST](https://arxiv.org/abs/2603.03482) 主张模拟潜在的 *3D* 场景而非像素历史；[MBench](https://arxiv.org/abs/2606.00793) 指出现有基准几乎没有衡量记忆能力。正确的状态究竟是像素、潜在 3D、点潜变量（[Terra](https://arxiv.org/abs/2510.14977)），还是二者混合（[AEON](https://arxiv.org/abs/2610.28631) 统一了视频与 3D 世界模型）？
- **把 3D 一致性变成可测量的属性。** [Orbia](https://arxiv.org/abs/2610.20693) 通过受控的探索与回访，直接追问生成的视频是否构成一个一致的 3D 世界。看起来对、却无法“回头再看”的世界模型，并不是真正的世界模型。
- **超越相机的动作空间。** 大多数模型只接受相机或键盘动作。[TouchéWorld](https://arxiv.org/abs/2611.06061) 加入了手势交互；[ActionParty](https://arxiv.org/abs/2604.02330) 把动作绑定到多个主体上。接触、关节物体和多智能体交互仍是开放问题（[Omni-WorldBench](https://arxiv.org/abs/2603.22212) 专门评测交互）。
- **视频生成模型本身是好的空间表征吗？** [VLM 与视频生成预训练对空间智能的实证比较](https://arxiv.org/abs/2605.28132) 正面讨论了这一点。答案决定了世界模型是通往空间理解的路径，还是一条平行的研究线。

**与我工作的衔接。** UCanDance 本质上是长时程生成问题：让舞者的身份和动作在几分钟内保持连贯，与世界模型面临的“状态漂移”是同一个问题，只是限定在人体上。Perceptio 的核心思路，*把空间状态显式写成 token*，天然适合回答“持久状态”问题：一个输出并以可解码的深度/分割 token 为条件的世界模型，其状态是可以检查和纠正的。

**具体选题。**
- 以一组紧凑空间 token（深度 + 实例）作为循环状态的世界模型，用类似 Orbia 的回访一致性指标评测。
- 面向以人为中心长视频（舞蹈、体育）的“记忆压力测试”，要求人体和场景同时保持一致。

**风险与算力。** **风险：高。** 这是前沿实验室的主战场，任何看起来像“更大的世界模型”的工作都极易被抢发。**算力：训练为 C–D**；评测、探针、在开源模型（minWM、Matrix-Game）之上做记忆模块和测试时方法为 **A–B**。给学术界的建议：做*状态、记忆和评测*，不要做预训练。

---

## 2. 空间推理 VLM

**为什么是现在。** VLM 依旧说不清“在哪里”。基础文献已经很完整（[SpatialVLM](https://arxiv.org/abs/2401.12168)、[Thinking in Space / VSI-Bench](https://arxiv.org/abs/2412.14171)、[Eyes Wide Shut](https://arxiv.org/abs/2401.06209)、[Cambrian-1](https://arxiv.org/abs/2406.16860)）。2025–26 年，这个方向分化成几条相互竞争的路线：

- **堆数据**：[SenseNova-SI](https://arxiv.org/abs/2511.13719) 在 Qwen3-VL、InternVL3 和 Bagel 之上构建了八百万条空间数据。
- **融合 3D 几何编码器**，多为 [VGGT](https://arxiv.org/abs/2503.11651) 式：[SpatialStack](https://arxiv.org/abs/2603.27437) 主张分层融合而非只融合深层特征；[SpaceMind](https://arxiv.org/abs/2511.23075) 采用相机引导的融合。
- **在序列内显式感知**：我们的 [Perceptio](https://arxiv.org/abs/2603.18795) 先输出分割与深度 token 再作答。
- **用图像 / 工具 / 想象来思考**：[MindJourney](https://arxiv.org/abs/2507.12508) 在测试时把 VLM 与视频世界模型耦合；[SpaceTools](https://arxiv.org/abs/2512.04069) 用强化学习训练工具使用；[SpatialImaginer](https://arxiv.org/abs/2604.17385) 做自适应视觉想象；[Thinking with Images without Coordinates](https://arxiv.org/abs/2610.14265) 与 [Thinking Without Images](https://arxiv.org/abs/2606.08719) 则质疑显式的视觉操作是否必要。
- **主动探索**：[From Views to Worlds](https://arxiv.org/abs/2610.24676) 让 VLM 在 3D 世界中主动探索。

**核心未解问题。**

- **显式还是隐式？** 让模型*生成*几何（Perceptio、视觉思维链）更好，还是把几何*注入*模型（几何编码器、特征对齐）更好？目前还没有人在相同数据和算力下做过对比。
- **度量尺度、多视角与动态。** 大多数提升集中在单图、相对关系问题上。度量尺度、多视角一致性和时间维度（[Spatial4D-Bench](https://arxiv.org/abs/2601.00092)）仍然困难；多跳组合式问题（[MultihopSpatial](https://arxiv.org/abs/2603.18892)）暴露了更多短板。
- **空间推理的奖励。** 可验证奖励的强化学习对文本推理有效（[DeepSeek-R1](https://arxiv.org/abs/2501.12948)），但 RLVR 到底是扩展了 VLM 的能力边界，还是只是让已有能力更稳定，仍有争议（[Does RLVR Extend Reasoning Boundaries?](https://arxiv.org/abs/2511.00710)）。几何提供了可检查的中间答案，这是做过程奖励的真正机会。
- **思考的代价。** 额外的感知 token 会增加延迟。模型什么时候该“看得更仔细”，什么时候直接回答就好？

**与我工作的衔接。** 这是离 Perceptio 最近、我优势也最明显的方向。自然的下一步：
- **从深度 token 到 3D/4D token**：把单目深度码本换成从多视角几何模型（[VGGT](https://arxiv.org/abs/2503.11651)、[π³](https://arxiv.org/abs/2507.13347)）蒸馏的点图码本，让模型画出多视角或时序几何草图。
- **把感知 token 当作过程奖励**：这些 token 能解码回掩码和深度图，中间步骤可以与教师模型对照打分。这为强化学习提供了稠密、可验证的奖励，而纯文本思维链没有这种条件。
- **自适应感知**：学习何时才输出空间 token，回应“思考代价”的问题。
- **受控对比**：在同一基座和数据下比较显式 token、编码器融合与特征对齐。这本身就是一篇有价值的论文。

**风险与算力。** **风险：中。** 拥挤，但足够分散，思路清晰、消融干净的工作依然能脱颖而出。主要风险是基准饱和与捷径（见第 7 节）。**算力：B。** 用 16–64 卡在几百万条数据上全量微调 7–8B VLM 是可行的。

---

## 3. 4D 生成与动态场景重建

**为什么是现在。** 前馈式几何（[DUSt3R](https://arxiv.org/abs/2312.14132)、[VGGT](https://arxiv.org/abs/2503.11651)、[π³](https://arxiv.org/abs/2507.13347)）已经扩展到运动场景（[MonST3R](https://arxiv.org/abs/2410.03825)、[MegaSaM](https://arxiv.org/abs/2412.04463)、[CUT3R](https://arxiv.org/abs/2501.12387)）。近期工作在一次前向中完成动态重建（[SM4RT](https://arxiv.org/abs/2611.08436)、[DynamicVGGT](https://arxiv.org/abs/2603.08254)、[IGGT4D](https://arxiv.org/abs/2607.19228)）。生成方面，视频扩散模型正被改造成 4D 生成器（[4DNeX](https://arxiv.org/abs/2508.13154) 在千万级伪标注数据上微调视频模型实现图像到 4D；[One4D](https://arxiv.org/abs/2511.18922) 统一了 4D 生成与重建）。[NeoVerse](https://arxiv.org/abs/2601.00393) 和 [VerseCrafter](https://arxiv.org/abs/2601.05138) 把它定位为“4D 世界模型”。[OmniWorld](https://arxiv.org/abs/2509.12201) 等数据工作瞄准的是最主要的瓶颈。综述可读 [Reconstructing 4D Spatial Intelligence](https://arxiv.org/abs/2507.21045)。

**核心未解问题。**

- **数据。** 真实的多视角动态数据稀缺。能否用伪标签从*单目野外视频*中学习 4D（NeoVerse 和 [SAGE](https://arxiv.org/abs/2602.07891) 的思路），同时不把教师模型的错误固化进去？
- **重建与生成合一。** 重建要求忠于观测，生成要求合理地补全未见区域。两者共享的表征仍未找到。
- **关节与形变的人和物体。** 有人、衣物和关节物体的场景会打破刚体假设。人体运动正是 4D 方法失败最明显的地方。
- **表征选择。** 动态高斯、逐帧点图、轨迹，还是潜在 4D 场？每种选择在可编辑性、速度和一致性上取舍不同。

**与我工作的衔接。** UCanDance 由姿态序列生成长舞蹈视频；显然的下一步是让舞者变成 *4D* 的，同一段动作可以从任意视角重新渲染，身体也保持物理一致。近期的音乐驱动舞蹈视频工作（[MACE-Dance](https://arxiv.org/abs/2512.18181)、[FlowDance](https://arxiv.org/abs/2608.15818)、[OmniDance](https://arxiv.org/abs/2606.30019)）都是 2D 的，空白很明确。PointNeXt 式点云骨干，以及 PointNets 缩放研究的经验（训练配方和架构同样重要），可以直接用到逐帧点图和 4D 点潜变量上。

**具体选题。**
- 音乐驱动的 *4D* 人体生成：姿态扩散 → 4D 人体（高斯或点图）→ 多视角视频，以长时程一致性为核心指标。
- 精心调优的点云 4D 骨干：为动态点图做一次“PointNeXt 时刻”，说明当前进展有多少来自训练配方。

**风险与算力。** **风险：中。** 很活跃，但尚未被单一路线垄断；重建的评测相对明确，生成的评测较弱。**算力：B**（前馈重建、用 LoRA 微调视频模型）；**C**（基于视频基础模型全量训练 4D 生成器）。

---

## 4. 具身智能的视觉基础（VLA）

**为什么是现在。** 基于 VLM 的通用机器人策略（[OpenVLA](https://arxiv.org/abs/2406.09246)、[π0](https://arxiv.org/abs/2410.24164)、[π0.5](https://arxiv.org/abs/2504.16054)、[GR00T N1](https://arxiv.org/abs/2503.14734)、[Gemini Robotics](https://arxiv.org/abs/2503.20020)、[MolmoAct2](https://arxiv.org/abs/2605.02881)）已经成为默认范式。自监督视频表征（[V-JEPA 2](https://arxiv.org/abs/2506.09985)）是另一条竞争路线。相关综述已有多篇（[Pure VLA 综述](https://arxiv.org/abs/2509.19012)、[Anatomy of VLA models](https://arxiv.org/abs/2512.11362)）。

**核心未解问题。**

- **VLA 会遗忘几何。** [From Recovery to Drop-off](https://arxiv.org/abs/2608.08904) 对一对权重匹配的 VLM/VLA 做逐层探针，发现 VLA 在每一层的深度可解码性都更差，而且在后几层还会额外崩塌。这是对问题非常干净的陈述：动作后训练侵蚀了操作所需的空间感知。
- **如何把 3D 加回去。** 候选方案：辅助量化深度预测（[QDepth-VLA](https://arxiv.org/abs/2510.14836)，预测 VQ-VAE 深度 token）、深度感知推理（[DepthVLA](https://arxiv.org/abs/2510.13375)）、与 3D 基础模型特征的隐式对齐（[Spatial Forcing](https://arxiv.org/abs/2510.12276)）、高斯几何（[GaussVLA](https://arxiv.org/abs/2608.24959)、[GeoPredict](https://arxiv.org/abs/2512.16811)），以及主动感知（[ActiveVLA](https://arxiv.org/abs/2601.08325)）。
- **从人类视频中学习。** 机器人数据是瓶颈；在人类视频上做潜在动作预训练是主要押注（[CLAP](https://arxiv.org/abs/2601.04061)、[LAPT-Scale](https://arxiv.org/abs/2610.13732)、[DreamX](https://arxiv.org/abs/2611.05377)、[Being-H0](https://arxiv.org/abs/2507.15597)）。
- **把世界模型当作 VLA 后训练的模拟器**（[WoVR](https://arxiv.org/abs/2602.13977)、[RynnVLA-002](https://arxiv.org/abs/2511.17502)、[WorldBagel](https://arxiv.org/abs/2607.03461)），与第 1 节相连。VLA 是否已经隐式包含世界模型（[Emergent World Representations in OpenVLA](https://arxiv.org/abs/2509.24559)）？
- **部件与可供性级理解。** 操作发生在把手、盖子、铰链这一层级，而不是整个物体（[PAR3D](https://arxiv.org/abs/2606.06485)、[AffordAny](https://arxiv.org/abs/2608.20720)）。

**与我工作的衔接。** Perceptio 的深度 token 正好回应“VLA 遗忘几何”的发现：在输出动作*之前*先生成空间 token，作为一个无法被优化掉的感知步骤。QDepth-VLA 说明这个想法已经有人在做（用 VQ-VAE 深度 token 作辅助监督），所以速度和更锐利的切入点很重要，例如把感知 token 与待操作*部件*的分割结合起来。3D-CoMPaT / 3DCoMPaT++ 有细粒度的部件与材质标注，恰好是抓取和工具使用需要的信息（材质决定摩擦、易碎程度和重量）。

**风险与算力。** **风险：中–高。** 真机结果需要硬件且难以复现；仿真结果便宜，但常常不被信任。**算力：B**（用开源 VLA 做 LIBERO、SimplerEnv 类仿真基准）；**C + 硬件**（真实世界的通用性结论）。适合学术界的策略：分析工作，加上一个能插入开源 VLA 的感知模块。

---

## 5. 统一理解-生成多模态模型

**为什么是现在。** 一个既能读图又能画图的模型是显而易见的终局，设计空间已被大量探索：[Transfusion](https://arxiv.org/abs/2408.11039)、[Show-o](https://arxiv.org/abs/2408.12528)、[Emu3](https://arxiv.org/abs/2409.18869)、[Janus](https://arxiv.org/abs/2410.13848)、[BLIP3-o](https://arxiv.org/abs/2505.09568)、[BAGEL](https://arxiv.org/abs/2505.14683)、[OmniGen2](https://arxiv.org/abs/2506.18871)。2026 年的工作开始质疑编码器设计本身：[Tuna-2](https://arxiv.org/abs/2604.24763) 声称像素嵌入优于独立视觉编码器；[PixelUMM](https://arxiv.org/abs/2609.38597) 对图像和视频都不用编码器；[Ming-UniVision](https://arxiv.org/abs/2510.06590) 使用单一连续 tokenizer；[Towards Scalable Pre-training of Visual Tokenizers](https://arxiv.org/abs/2512.13687) 认为以重建为目标训练的潜空间在生成上无法随算力扩展。

**核心未解问题。**

- **协同被默认，却很少被测量。** 多数论文分别报告理解和生成。[Unison](https://arxiv.org/abs/2606.26984) 评测*联合*任务；[GSI-Bench](https://arxiv.org/abs/2604.20570) 考察生成模型在编辑时是否遵守 3D 约束。生成是否提升理解（或者反过来），仍是一个开放的实证问题。
- **Tokenizer。** 语义潜空间还是像素保真潜空间，离散还是连续，共享还是解耦？这是核心设计选择，尚无定论。
- **通过生成来推理。** [Thinking with Video](https://arxiv.org/abs/2511.04570) 提出把视频生成作为推理媒介。统一模型能否“边画边想”，并可测量地提升答案质量？

**与我工作的衔接。** Perceptio 可以看作一个小型统一模型：它*生成*感知结果（掩码、深度码）来提升*理解*。这提供了一个定义清晰的协同测试案例：生成的是有真值的几何量，而不是自由形式的图像，所以“生成是否有帮助”可以被干净地测量。UCanDance 中长时程视频扩散的经验，也可以迁移到统一模型的视频侧。

**风险与算力。** **风险：高。** 极其拥挤，由能做预训练的实验室主导。**算力：预训练任何有意义的模型需 C**；在开源模型（BAGEL、Janus、OmniGen2）上做后训练和分析为 **B**。建议切入点：协同的测量与空间约束下的生成，而不是新架构。

---

## 6. 高效视觉架构

**为什么是现在。** 视频 MLLM 和世界模型都受限于视觉 token 数量与平方复杂度注意力。活跃的方向有：

- **VLM 中的 token 削减**：仅 2026 年就有几十篇剪枝论文。更有意思的是质疑范式本身的工作：[Reroute, Don't Remove](https://arxiv.org/abs/2606.12412) 指出 token 重要性随层深变化，不可逆的剪枝很脆弱；[Who Speaks for the Pruned?](https://arxiv.org/abs/2609.03158) 把剪枝视为覆盖优化；长视频方面有[查询感知 tokenizer](https://arxiv.org/abs/2511.11910)。
- **次平方骨干**：[把二维行扫描传播（GSPN）扩展到基础模型规模的编码器](https://arxiv.org/abs/2606.00746)、[JetViT](https://arxiv.org/abs/2605.26636)；生成侧有自回归视频的 KV 缓存压缩（[Forcing-KV](https://arxiv.org/abs/2605.09681)、[Deep Forcing](https://arxiv.org/abs/2512.05081)）。
- **3D 骨干**：[Point Transformer V3](https://arxiv.org/abs/2312.10035) 和 [Sonata](https://arxiv.org/abs/2503.16429) 为点云表征学习设立了标杆。

**核心未解问题。**

- **对*空间*任务而言，哪些 token 重要？** 剪枝方法是在通用 VQA 上调的。空间与定位任务可能恰恰需要那些被丢掉的背景 token。
- **收益来自架构还是配方？** PointNeXt 的教训（训练得当的旧架构常常能追平新架构）很少被应用到线性注意力和 SSM 视觉骨干上。
- **流式推理。** 实时世界模型和机器人需要在无限长视频上以常数内存推理。

**与我工作的衔接。** PointNeXt 和 PointNets 缩放研究正是“配方 vs. 架构”类型的论文。对高效视觉骨干（或在空间基准上对 token 削减方法）做严谨、算力对齐的比较，是高价值、低算力、我也很擅长的贡献。Perceptio 的深度码本本身也是一种压缩：把稠密深度图变成一段短 token 序列。

**风险与算力。** **风险：低–中。** 增量式剪枝论文已经饱和，严谨的分析和配方研究还没有。**算力：A–B。**

---

## 7. 视觉评测与可解释性

**为什么是现在。** 上面每个方向都受限于评测。新基准层出不穷（[MBench](https://arxiv.org/abs/2606.00793)、[Orbia](https://arxiv.org/abs/2610.20693)、[Omni-WorldBench](https://arxiv.org/abs/2603.22212)、[Spatial4D-Bench](https://arxiv.org/abs/2601.00092)、[Unison](https://arxiv.org/abs/2606.26984)；视频生成的物理性：[PhyWorldBench](https://arxiv.org/abs/2507.13428)、[Physion-Eval](https://arxiv.org/abs/2603.19607)、[PVBench](https://arxiv.org/abs/2610.26711)），但其中很多可以部分依靠文本先验解出。可解释性方面，稀疏自编码器已进入视觉和 VLA（[Spatial-SAE / 独立性先验](https://arxiv.org/abs/2610.04112)、[从语言到视觉的可解释性迁移](https://arxiv.org/abs/2605.24946)、[面向 VLA 策略的事件锚定 SAE](https://arxiv.org/abs/2605.17204)），机制分析也被用来诊断 VLM 的失败（[Do VLMs Have Bad Eyes?](https://arxiv.org/abs/2508.16652)）。

**核心未解问题。**

- **必须看图才能做的基准。** 视觉依赖性应该被测量而不是被假定：盲测基线、反事实图像、过滤掉仅凭文本可答的问题（[From Accuracy to Visual Dependence](https://arxiv.org/abs/2606.30220)、[视觉谄媚](https://arxiv.org/abs/2603.18373)）。
- **从物理和几何上评测生成式世界模型**：用测量（3D 重建、物体轨迹、物理量）代替 VLM 当裁判。
- **空间表征的可解释性。** VLM 把深度存在哪里？为什么动作训练后会消失（见第 4 节）？Spatial-SAE 的结果表明，假设图块相互独立的字典会把视觉概念打碎。
- **组合泛化。** 模型能否识别已知部件和材质的*未见组合*？

**与我工作的衔接。** 3D-CoMPaT 本来就是为组合式识别（部件 × 材质 × 形状）而建，是检验 VLM 与 3D-VLM 组合泛化的天然测试床。Perceptio 的 token 在设计上就可解释：可以解码出模型“看到了什么”，再检查答案是否与之一致。这支持*忠实性*指标：答案是否真的依赖于那张空间草图？

**风险与算力。** **风险：低。** 永远被需要，而难以走捷径的基准论文生命力很长。风险在于做出一个几个月内就饱和的基准。**算力：A。**

---

## 跨方向的观察

1. **显式空间状态是贯穿始终的主线。** 世界模型需要持久状态（第 1 节），空间 VLM 需要几何（第 2 节），4D 模型需要表征（第 3 节），VLA 丢失深度（第 4 节），统一模型需要协同的测试（第 5 节）。在 token 流中引入可解码、可检查的空间表征，能同时回应这些问题。
2. **人体运动被低估了。** 世界模型和 4D 方法大多在静态或刚体场景上评测。长时程、物理合理的人体（舞蹈、体育、操作）是生成与感知交汇处的空白。
3. **配方胜过架构的情况，比论文承认的更多。** 上述每个方向都很少有算力对齐的比较，而这类工作对学术界来说成本很低。
4. **评测是产生影响力最便宜的方式。** 几乎每个方向上，短期内被引用最多的贡献，很可能就是那些定义“一致”“空间”“协同”含义的基准。

## 我接下来打算做什么

我 2027 年的优先级，按顺序：

1. **把空间 token 作为通用接口**（第 2 → 4 → 1 节）：把 Perceptio 从单目深度扩展到多视角/时序几何 token，用作可验证的过程奖励，并作为显式状态接入 VLA 和世界模型。
2. **4D 长时程人体生成**（第 3 节，延续 UCanDance）：音乐或文本驱动、能保持数分钟一致、可从任意视角重新渲染的 4D 人体。
3. **测量**（第 7 节）：空间推理的忠实性，以及基于 3DCoMPaT++ 的部件/材质组合泛化。

如果你也在做这些方向并想合作，或者在为 2027 年招人，非常欢迎联系我，可以在主页上预约 [coffee chat](/zh/#beyond)。

---

*方法：基于 arXiv API 对标题与摘要的检索，时间范围 2025 年 7 月至 2026 年 11 月，另加更早的奠基性论文。撰写时所有 arXiv 编号均已通过 arXiv API 核对。如果我对某篇论文的描述有误，请告诉我，我会更正。*
