---
title: "Computer vision directions worth working on in 2027"
subtitle: "A research survey written at the end of my PhD: seven directions, their open problems, where my own work fits, and an honest estimate of risk and compute"
summary: "World models, spatial-reasoning VLMs, 4D generation, VLA perception, unified understanding-generation models, efficient vision architectures, and evaluation and interpretability. For each one: the core open problems, recent arXiv work to start from, how it connects to Perceptio, UCanDance, PointNeXt and 3D-CoMPaT, and how risky and compute-hungry it is."
authors: [admin]
tags: [research directions, world models, spatial intelligence, VLM, 4D, VLA, unified models, efficient vision, evaluation, survey]
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

I am finishing my PhD and choosing what to work on next. To make that choice properly I went through roughly a year and a half of arXiv (July 2025 to early November 2026) and asked the same four questions of every direction that kept coming up:

1. **What is still unsolved?** Not "what is popular", but which questions nobody has a convincing answer to yet.
2. **Where should someone start reading?** A few recent papers per direction, plus the older work they build on.
3. **What can I bring?** How it connects to my own work: [Perceptio](/post/perceptio-spatial-tokens/) (spatial-token VLM), [UCanDance](/publication/underreview2026dance/) (long-horizon music-to-dance video generation), [PointNeXt](https://arxiv.org/abs/2206.04670) and the [PointNets scaling study](/publication/3dv2025pointnets/) (3D perception), and [3D-CoMPaT](https://www.ecva.net/papers/eccv_2022/papers_ECCV/html/3631_ECCV_2022_paper.php) / [3DCoMPaT++](https://arxiv.org/abs/2310.18511) (part- and material-level 3D data).
4. **How risky is it, and how much compute does it take?** This decides whether a small academic group or a single person can do it at all.

This post is my working notes, cleaned up. I hope it helps other students who are choosing a topic.

> **Caveats.** Most papers cited here are arXiv preprints from the last 16 months and many have not been peer-reviewed yet. I describe them only by what their abstracts claim. The selection reflects my interests, not the whole field. The risk and compute ratings are my own judgement.

## How to read the ratings

**Compute tiers** (rough GPU budget to produce one competitive paper, H100-class):

| Tier | Budget | What it buys |
|---|---|---|
| **A** | ≤ 8 GPUs for a few weeks | Benchmarks, analysis, probing, fine-tuning ≤ 8B models with LoRA |
| **B** | 8–64 GPUs | Full fine-tuning of 7–8B VLMs, training feed-forward 3D/4D models, video-model post-training |
| **C** | 64–512 GPUs | Pre-training mid-size video or unified models, large-scale data curation |
| **D** | 1000+ GPUs | Frontier world models and foundation models; realistically industry only |

**Risk** combines three things: *crowding* (how likely you are to be scooped), *evaluation instability* (whether the benchmarks you need exist and can be trusted), and *dependency* (whether you need a closed model, robot hardware or data you cannot get).

## Overview

| # | Direction | Core open problem in one line | Link to my work | Risk | Compute |
|---|---|---|---|---|---|
| 1 | World models and spatial intelligence | Turning beautiful video into a *persistent, consistent, actionable* state | UCanDance (long horizon), Perceptio (explicit 3D state) | High | C–D (A–B for evaluation) |
| 2 | Spatial-reasoning VLMs | Explicit vs. implicit geometry, and how to reward spatial reasoning | Perceptio, directly | Medium | B |
| 3 | 4D generation and dynamic reconstruction | One model that both reconstructs and generates dynamic scenes, trained on in-the-wild video | UCanDance, PointNeXt | Medium | B–C |
| 4 | Visual foundations for embodied AI (VLA) | VLAs lose spatial perception during action training | Perceptio (depth tokens), 3D-CoMPaT (parts) | Medium–High | B (sim) / C (real) |
| 5 | Unified understanding and generation | Does generation actually help understanding, and vice versa? | Perceptio (perception as generation) | High (crowded) | C |
| 6 | Efficient vision architectures | Long video and high resolution without quadratic cost or token loss | PointNeXt (training and scaling recipes) | Low–Medium | A–B |
| 7 | Evaluation and interpretability | Benchmarks that cannot be solved without looking, and mechanisms we can verify | Perceptio (inspectable tokens), 3D-CoMPaT (compositional data) | Low | A |

---

## 1. World models and spatial intelligence

**Why now.** Interactive video world models have moved from demos to open-source stacks. [Genie](https://arxiv.org/abs/2402.15391) showed that action-controllable environments can be learned from video; [Cosmos](https://arxiv.org/abs/2501.03575) released a world-foundation-model platform for physical AI; [Matrix-Game 2.0](https://arxiv.org/abs/2508.13009) and [minWM](https://arxiv.org/abs/2605.30263) give real-time, streaming, open pipelines (data, controllable fine-tuning, autoregressive training, few-step distillation). [Dreamer 4](https://arxiv.org/abs/2509.24527) trains agents by RL *inside* a learned world model in Minecraft. A good map of the area is the roadmap [Simulating the Visual World with Artificial Intelligence](https://arxiv.org/abs/2511.08585) and the survey [3D and 4D World Modeling](https://arxiv.org/abs/2509.07996).

**Core open problems.**

- **Persistent state and memory.** Frame-history models forget what is outside the context window. [PERSIST](https://arxiv.org/abs/2603.03482) argues for simulating a latent *3D* scene instead of pixel histories; [MBench](https://arxiv.org/abs/2606.00793) shows that memory is barely measured by existing benchmarks. What is the right state: pixels, latent 3D, point latents ([Terra](https://arxiv.org/abs/2510.14977)), or a hybrid ([AEON](https://arxiv.org/abs/2610.28631) unifies video and 3D world models)?
- **3D consistency as a measurable property.** [Orbia](https://arxiv.org/abs/2610.20693) asks directly whether generated videos form a consistent 3D world, with controlled exploration and revisits. A world model that looks right but cannot be revisited is not a world model.
- **Action spaces beyond the camera.** Most models only take camera or keyboard actions. [TouchéWorld](https://arxiv.org/abs/2611.06061) adds hand gestures; [ActionParty](https://arxiv.org/abs/2604.02330) binds actions to multiple subjects. Contact, articulation and multi-agent interaction are still open ([Omni-WorldBench](https://arxiv.org/abs/2603.22212) evaluates interaction specifically).
- **Is a video generator a good spatial representation at all?** [An empirical comparison of VLM and video-generation pre-training for spatial intelligence](https://arxiv.org/abs/2605.28132) addresses exactly this. The answer decides whether world models are a route to spatial understanding or a parallel line of work.

**Connection to my work.** UCanDance is a long-horizon generation problem: keeping a dancer's identity and motion coherent for minutes is the same "state drift" problem that world models face, just restricted to humans. Perceptio's idea, *write down the spatial state explicitly as tokens*, is a natural candidate for the persistent-state question: a world model that emits and conditions on decodable depth/segmentation tokens has a state you can inspect and correct.

**Concrete project ideas.**
- A world model whose recurrent state is a compact set of spatial tokens (depth plus instance), evaluated with revisit-consistency metrics à la Orbia.
- A "memory stress test" for human-centric long video (dance, sports), where the body and the scene must both persist.

**Risk and compute.** **Risk: high.** This is where frontier labs compete, and scoop risk is extreme for anything that looks like "a bigger world model". **Compute: C–D** for training, **A–B** for evaluation, probing, memory modules on top of open models (minWM, Matrix-Game), and test-time methods. My advice for academics: work on *state, memory and evaluation*, not on pre-training.

---

## 2. Spatial-reasoning VLMs

**Why now.** VLMs are still poor at "where". The baseline literature is well established ([SpatialVLM](https://arxiv.org/abs/2401.12168), [Thinking in Space / VSI-Bench](https://arxiv.org/abs/2412.14171), [Eyes Wide Shut](https://arxiv.org/abs/2401.06209), [Cambrian-1](https://arxiv.org/abs/2406.16860)). In 2025–26 the field split into several competing recipes:

- **Scale the data**: [SenseNova-SI](https://arxiv.org/abs/2511.13719) curates eight million spatial samples on top of Qwen3-VL, InternVL3 and Bagel.
- **Fuse a 3D geometry encoder** into the VLM, usually [VGGT](https://arxiv.org/abs/2503.11651)-style: [SpatialStack](https://arxiv.org/abs/2603.27437) argues for layered rather than deep-only fusion; [SpaceMind](https://arxiv.org/abs/2511.23075) uses camera-guided fusion.
- **Make perception explicit inside the sequence**: our [Perceptio](https://arxiv.org/abs/2603.18795) emits segmentation and depth tokens before answering.
- **Think with images / tools / imagination**: [MindJourney](https://arxiv.org/abs/2507.12508) couples a VLM to a video world model at test time; [SpaceTools](https://arxiv.org/abs/2512.04069) trains tool use with RL; [SpatialImaginer](https://arxiv.org/abs/2604.17385) does adaptive visual imagination; [Thinking with Images without Coordinates](https://arxiv.org/abs/2610.14265) and [Thinking Without Images](https://arxiv.org/abs/2606.08719) question whether explicit visual manipulation is needed at all.
- **Active exploration**: [From Views to Worlds](https://arxiv.org/abs/2610.24676) lets the VLM explore 3D worlds.

**Core open problems.**

- **Explicit or implicit?** Is it better to *generate* geometry (Perceptio, visual CoT) or to *inject* it (geometry encoders, feature alignment)? Nobody has compared them under matched data and compute.
- **Metric, multi-view and dynamic.** Most gains are on single-image, relative questions. Metric scale, multi-view consistency and time ([Spatial4D-Bench](https://arxiv.org/abs/2601.00092)) remain hard; multi-hop compositional questions ([MultihopSpatial](https://arxiv.org/abs/2603.18892)) expose further gaps.
- **Rewards for spatial reasoning.** RL with verifiable rewards helps text reasoning ([DeepSeek-R1](https://arxiv.org/abs/2501.12948)), but whether RLVR extends VLM capability or only sharpens it is disputed ([Does RLVR Extend Reasoning Boundaries?](https://arxiv.org/abs/2511.00710)). Geometry offers checkable intermediate answers, which is a real opportunity for process rewards.
- **Cost of thinking.** Extra perception tokens cost latency. When should a model "look harder" and when should it just answer?

**Connection to my work.** This is the direction closest to Perceptio and the one where I have the clearest edge. Natural next steps:
- **From depth tokens to 3D/4D tokens**: replace the monocular depth codebook with a point-map codebook distilled from a multi-view geometry model ([VGGT](https://arxiv.org/abs/2503.11651), [π³](https://arxiv.org/abs/2507.13347)), so the model sketches multi-view or temporal geometry.
- **Perception tokens as process rewards**: because the tokens decode back into a mask and a depth map, the intermediate step can be scored against a teacher. That gives a dense, verifiable reward for RL, which text-only CoT does not have.
- **Adaptive perception**: learn when to emit spatial tokens at all, which addresses the cost question.
- **A matched comparison** of explicit tokens vs. encoder fusion vs. feature alignment, with the same base model and data. That would be a useful paper in its own right.

**Risk and compute.** **Risk: medium.** Crowded, but fragmented enough that a clear idea with a clean ablation still stands out. The main risk is benchmark saturation and shortcuts (see §7). **Compute: B.** Full fine-tuning of a 7–8B VLM on a few million samples is feasible with 16–64 GPUs.

---

## 3. 4D generation and dynamic scene reconstruction

**Why now.** Feed-forward geometry ([DUSt3R](https://arxiv.org/abs/2312.14132), [VGGT](https://arxiv.org/abs/2503.11651), [π³](https://arxiv.org/abs/2507.13347)) has been extended to motion ([MonST3R](https://arxiv.org/abs/2410.03825), [MegaSaM](https://arxiv.org/abs/2412.04463), [CUT3R](https://arxiv.org/abs/2501.12387)). Recent work does dynamic reconstruction in a single forward pass ([SM4RT](https://arxiv.org/abs/2611.08436), [DynamicVGGT](https://arxiv.org/abs/2603.08254), [IGGT4D](https://arxiv.org/abs/2607.19228)). On the generation side, video diffusion models are being turned into 4D generators ([4DNeX](https://arxiv.org/abs/2508.13154) fine-tunes a video model for image-to-4D with a 10M-scale pseudo-annotated dataset; [One4D](https://arxiv.org/abs/2511.18922) unifies 4D generation and reconstruction). [NeoVerse](https://arxiv.org/abs/2601.00393) and [VerseCrafter](https://arxiv.org/abs/2601.05138) frame this as a "4D world model". Data efforts like [OmniWorld](https://arxiv.org/abs/2509.12201) target the main bottleneck. Survey: [Reconstructing 4D Spatial Intelligence](https://arxiv.org/abs/2507.21045).

**Core open problems.**

- **Data.** Real multi-view dynamic data is scarce. Can we learn 4D from *monocular in-the-wild video* with pseudo-labels (the NeoVerse and [SAGE](https://arxiv.org/abs/2602.07891) philosophy) without baking in the teacher's errors?
- **Reconstruction and generation in one model.** Reconstruction needs fidelity to observations; generation needs to hallucinate unseen regions plausibly. A shared representation for both is still open.
- **Articulated and deformable humans and objects.** Scenes with people, cloth and articulated objects break rigid-scene assumptions. Human motion is where 4D methods fail most visibly.
- **Representation.** Dynamic Gaussians, point maps per frame, tracks, or a latent 4D field? Each choice trades editability, speed and consistency differently.

**Connection to my work.** UCanDance generates long dance videos from pose sequences; the obvious next step is to make the dancer *4D*, so the same motion can be re-rendered from any viewpoint and the body stays physically consistent. Recent music-to-dance video works ([MACE-Dance](https://arxiv.org/abs/2512.18181), [FlowDance](https://arxiv.org/abs/2608.15818), [OmniDance](https://arxiv.org/abs/2606.30019)) are all 2D, which leaves a clear gap. PointNeXt-style point backbones and the lessons from the PointNets scaling study (training recipes matter as much as architecture) apply directly to per-frame point maps and 4D point latents.

**Concrete project ideas.**
- Music-driven *4D* human generation: pose diffusion → 4D human (Gaussians or point maps) → multi-view video, with long-horizon consistency as the key metric.
- A carefully tuned point-based 4D backbone: a "PointNeXt moment" for dynamic point maps, showing how much of current progress is due to training recipes.

**Risk and compute.** **Risk: medium.** Active but not yet dominated by one recipe; evaluation is reasonably well defined for reconstruction, weaker for generation. **Compute: B** for feed-forward reconstruction and fine-tuning video models with LoRA; **C** for training a 4D generator from a video foundation model at full scale.

---

## 4. Visual foundations for embodied AI (VLA)

**Why now.** Generalist robot policies built on VLMs ([OpenVLA](https://arxiv.org/abs/2406.09246), [π0](https://arxiv.org/abs/2410.24164), [π0.5](https://arxiv.org/abs/2504.16054), [GR00T N1](https://arxiv.org/abs/2503.14734), [Gemini Robotics](https://arxiv.org/abs/2503.20020), [MolmoAct2](https://arxiv.org/abs/2605.02881)) are now the default. Self-supervised video representations ([V-JEPA 2](https://arxiv.org/abs/2506.09985)) are a competing foundation. There are already several surveys ([Pure VLA survey](https://arxiv.org/abs/2509.19012), [Anatomy of VLA models](https://arxiv.org/abs/2512.11362)).

**Core open problems.**

- **VLAs forget geometry.** [From Recovery to Drop-off](https://arxiv.org/abs/2608.08904) probes a weight-matched VLM/VLA pair and finds the VLA decodes depth worse at every layer, with an extra collapse in late layers. This is a clean statement of the problem: action post-training erodes the spatial perception we need for manipulation.
- **How to put 3D back in.** Candidates: auxiliary quantized-depth prediction ([QDepth-VLA](https://arxiv.org/abs/2510.14836), which predicts VQ-VAE depth tokens), depth-aware reasoning ([DepthVLA](https://arxiv.org/abs/2510.13375)), implicit alignment to 3D foundation-model features ([Spatial Forcing](https://arxiv.org/abs/2510.12276)), Gaussian geometry ([GaussVLA](https://arxiv.org/abs/2608.24959), [GeoPredict](https://arxiv.org/abs/2512.16811)), and active perception ([ActiveVLA](https://arxiv.org/abs/2601.08325)).
- **Learning from human video.** Robot data is the bottleneck; latent-action pre-training on human video is the main bet ([CLAP](https://arxiv.org/abs/2601.04061), [LAPT-Scale](https://arxiv.org/abs/2610.13732), [DreamX](https://arxiv.org/abs/2611.05377), [Being-H0](https://arxiv.org/abs/2507.15597)).
- **World models as simulators for VLA post-training** ([WoVR](https://arxiv.org/abs/2602.13977), [RynnVLA-002](https://arxiv.org/abs/2511.17502), [WorldBagel](https://arxiv.org/abs/2607.03461)), which links back to §1. Do VLAs already contain implicit world models ([Emergent World Representations in OpenVLA](https://arxiv.org/abs/2509.24559))?
- **Part- and affordance-level understanding.** Manipulation happens at the level of handles, lids and hinges, not whole objects ([PAR3D](https://arxiv.org/abs/2606.06485), [AffordAny](https://arxiv.org/abs/2608.20720)).

**Connection to my work.** Perceptio's depth tokens are a direct answer to the "VLAs forget geometry" finding: generate spatial tokens *before* actions, as a perception step that cannot be optimised away. QDepth-VLA shows that the idea is already in the air (VQ-VAE depth tokens as auxiliary supervision), so speed and a sharper angle matter, for example combining perception tokens with segmentation of the *part* to be manipulated. 3D-CoMPaT / 3DCoMPaT++ contain fine-grained part and material annotations, which are exactly what grasping and tool use need (material determines friction, fragility and weight).

**Risk and compute.** **Risk: medium–high.** Real-robot results need hardware and are hard to reproduce; simulation results are cheaper but often not trusted. **Compute: B** for simulation benchmarks (LIBERO, SimplerEnv-style) with open VLAs; **C** plus hardware for real-world generalist claims. A good academic strategy is analysis plus a perception module that plugs into open VLAs.

---

## 5. Unified understanding-and-generation models

**Why now.** One model that both reads and writes images is the obvious end state, and the design space has been explored aggressively: [Transfusion](https://arxiv.org/abs/2408.11039), [Show-o](https://arxiv.org/abs/2408.12528), [Emu3](https://arxiv.org/abs/2409.18869), [Janus](https://arxiv.org/abs/2410.13848), [BLIP3-o](https://arxiv.org/abs/2505.09568), [BAGEL](https://arxiv.org/abs/2505.14683), [OmniGen2](https://arxiv.org/abs/2506.18871). 2026 work questions the encoder design itself: [Tuna-2](https://arxiv.org/abs/2604.24763) claims pixel embeddings beat separate vision encoders; [PixelUMM](https://arxiv.org/abs/2609.38597) is encoder-free for images and video; [Ming-UniVision](https://arxiv.org/abs/2510.06590) uses one continuous tokenizer; [Towards Scalable Pre-training of Visual Tokenizers](https://arxiv.org/abs/2512.13687) argues that reconstruction-trained latents do not scale for generation.

**Core open problems.**

- **Synergy is assumed, rarely measured.** Most papers report understanding and generation separately. [Unison](https://arxiv.org/abs/2606.26984) benchmarks *joint* tasks; [GSI-Bench](https://arxiv.org/abs/2604.20570) asks whether generative models respect 3D constraints when editing. Whether generation improves understanding (or the reverse) is still an open empirical question.
- **The tokenizer.** Semantic vs. pixel-faithful latents, discrete vs. continuous, shared vs. decoupled. This is the central design choice and it is unsettled.
- **Reasoning through generation.** [Thinking with Video](https://arxiv.org/abs/2511.04570) proposes video generation as a reasoning medium. Can a unified model "draw to think" in a way that measurably improves answers?

**Connection to my work.** Perceptio can be read as a small unified model: it *generates* perception (masks, depth codes) to improve *understanding*. That gives a well-defined synergy test case, where the generated output is a geometric quantity with ground truth rather than a free-form image, so "did generation help?" can be measured cleanly. UCanDance experience with long-horizon video diffusion transfers to the video side of unified models.

**Risk and compute.** **Risk: high.** Very crowded, dominated by labs that can pre-train. **Compute: C** to pre-train anything meaningful; **B** for post-training and analysis of open models (BAGEL, Janus, OmniGen2). Recommended angle: measurement of synergy and spatially grounded generation, not a new architecture.

---

## 6. Efficient vision architectures

**Why now.** Video MLLMs and world models are bottlenecked by the number of visual tokens and quadratic attention. Two lines are active:

- **Token reduction in VLMs**: dozens of pruning papers in 2026 alone. The more interesting ones question the paradigm: [Reroute, Don't Remove](https://arxiv.org/abs/2606.12412) shows token importance changes with depth, so irreversible pruning is fragile; [Who Speaks for the Pruned?](https://arxiv.org/abs/2609.03158) treats pruning as coverage optimisation; for long video, [query-aware tokenizers](https://arxiv.org/abs/2511.11910).
- **Sub-quadratic backbones**: [scaling 2D line-scan propagation (GSPN) to foundation-scale encoders](https://arxiv.org/abs/2606.00746), [JetViT](https://arxiv.org/abs/2605.26636), and for generation, KV-cache compression for autoregressive video ([Forcing-KV](https://arxiv.org/abs/2605.09681), [Deep Forcing](https://arxiv.org/abs/2512.05081)).
- **3D backbones**: [Point Transformer V3](https://arxiv.org/abs/2312.10035) and [Sonata](https://arxiv.org/abs/2503.16429) set the bar for point-cloud representation learning.

**Core open problems.**

- **Which tokens matter for *spatial* tasks?** Pruning is tuned on general VQA. Spatial and grounding tasks may need exactly the background tokens that get dropped.
- **Is the gain from the architecture or from the recipe?** The PointNeXt lesson, that a well-trained old architecture often matches a new one, has rarely been applied to linear-attention and SSM vision backbones.
- **Streaming.** Real-time world models and robots need constant-memory inference over unbounded video.

**Connection to my work.** PointNeXt and the PointNets scaling study are exactly "recipe vs. architecture" papers. A careful, compute-matched comparison of efficient vision backbones (or of token-reduction methods on spatial benchmarks) is a high-value, low-compute contribution I am well placed to do. Perceptio's depth codebook is also a form of compression: a dense depth map becomes a short token sequence.

**Risk and compute.** **Risk: low–medium.** Incremental pruning papers are saturated; careful analyses and recipes are not. **Compute: A–B.**

---

## 7. Visual evaluation and interpretability

**Why now.** Each of the directions above is limited by evaluation. Benchmarks are being created at a high rate ([MBench](https://arxiv.org/abs/2606.00793), [Orbia](https://arxiv.org/abs/2610.20693), [Omni-WorldBench](https://arxiv.org/abs/2603.22212), [Spatial4D-Bench](https://arxiv.org/abs/2601.00092), [Unison](https://arxiv.org/abs/2606.26984); physics in video generation: [PhyWorldBench](https://arxiv.org/abs/2507.13428), [Physion-Eval](https://arxiv.org/abs/2603.19607), [PVBench](https://arxiv.org/abs/2610.26711)), but many can be partly solved from text priors. On interpretability, sparse autoencoders have moved into vision and VLAs ([Spatial-SAE / independence prior](https://arxiv.org/abs/2610.04112), [interpretability transfer from language to vision](https://arxiv.org/abs/2605.24946), [event-grounded SAEs for VLA policies](https://arxiv.org/abs/2605.17204)), and mechanistic analyses diagnose VLM failures ([Do VLMs Have Bad Eyes?](https://arxiv.org/abs/2508.16652)).

**Core open problems.**

- **Benchmarks that require looking.** Visual dependence should be measured, not assumed: blind baselines, counterfactual images, and filtering of questions answerable from text ([From Accuracy to Visual Dependence](https://arxiv.org/abs/2606.30220), [visual sycophancy](https://arxiv.org/abs/2603.18373)).
- **Evaluating generative world models physically and geometrically**, with measurements (3D reconstruction, object tracks, physical quantities) instead of VLM-as-judge.
- **Interpretability for spatial representations.** Where does a VLM store depth, and why does it disappear after action training (see §4)? Spatial SAEs suggest that patch-independent dictionaries fragment visual concepts.
- **Compositional generalisation.** Can models recognise unseen *combinations* of known parts and materials?

**Connection to my work.** 3D-CoMPaT was built for compositional recognition (part × material × shape), which makes it a natural test bed for compositional generalisation in VLMs and 3D-VLMs. Perceptio's tokens are interpretable by design: you can decode what the model "saw" and check whether the answer is consistent with it. That supports *faithfulness* metrics: does the answer actually depend on the spatial sketch?

**Risk and compute.** **Risk: low.** Always needed, and benchmark papers age well if they are hard to shortcut. The risk is building a benchmark that is saturated within months. **Compute: A.**

---

## Cross-cutting observations

1. **Explicit spatial state is the common thread.** World models need a persistent state (§1), spatial VLMs need geometry (§2), 4D models need a representation (§3), VLAs lose depth (§4), unified models need a test of synergy (§5). A decodable, inspectable spatial representation inside the token stream addresses all of them.
2. **Human motion is underserved.** World models and 4D methods are mostly evaluated on static or rigid scenes. Long-horizon, physically plausible humans (dance, sports, manipulation) are a gap where generation and perception meet.
3. **Recipes beat architectures more often than papers admit.** Compute-matched comparisons are rare in every direction above, and they are cheap for academics to produce.
4. **Evaluation is the cheapest way to have impact.** In almost every direction, the most cited near-term contributions may well be the benchmarks that define what "consistent", "spatial" or "synergistic" means.

## What I plan to work on

My own priorities for 2027, in order:

1. **Spatial tokens as a general interface** (§2 → §4 → §1): extend Perceptio from monocular depth to multi-view/temporal geometry tokens, use them as verifiable process rewards, and plug them into VLAs and world models as an explicit state.
2. **4D long-horizon human generation** (§3, building on UCanDance): music- or text-driven 4D humans that stay consistent for minutes and can be re-rendered from any viewpoint.
3. **Measurement** (§7): faithfulness of spatial reasoning, and compositional part/material generalisation using 3DCoMPaT++.

If you are working on any of these and want to collaborate, or are hiring for 2027, I would love to talk. You can book a [coffee chat](/#beyond) from the homepage.

---

*Method: arXiv API searches over titles and abstracts, July 2025 to November 2026, plus older foundational papers. All arXiv IDs were checked against the arXiv API when this post was written. If I have misdescribed a paper, please tell me and I will fix it.*
