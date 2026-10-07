---
title: "Perceptio: letting a vision-language model sketch space before it answers"
subtitle: "A short research note on our 2026 preprint: segmentation and depth tokens as an explicit spatial chain of thought"
summary: "Large vision-language models describe images well but are vague about where things are. Perceptio makes the model emit segmentation and depth tokens first, then answer. Short note on the idea, the training tricks and the results."
authors: [admin]
tags: [Perceptio, VLM, spatial reasoning, research note]
categories: [Research]
date: 2026-10-06
draft: false
featured: false
image:
  caption: "Perceptio emits spatial tokens (segmentation, then depth) inside the autoregressive sequence before producing its answer."
  focal_point: ""
  preview_only: false
projects: []
---

**Paper:** [arXiv 2603.18795](https://arxiv.org/abs/2603.18795) · [Hugging Face](https://huggingface.co/papers/2603.18795) · [中文长文（知乎）](https://zhuanlan.zhihu.com/p/2035454055716233920)

## The problem

Large vision-language models are very good at *what* is in an image and surprisingly weak at *where*. Ask which of two objects is closer to the camera, or to segment "the second mug from the left", and the model has to infer the geometry implicitly. It never writes down a spatial interpretation that it, or we, could check.

## The idea: perceive first, then answer

Perceptio puts perception into the token stream. Before it answers, the model generates two kinds of spatial tokens inside the same autoregressive sequence:

1. **Segmentation tokens** based on SAM2, which ground the object being talked about;
2. **Depth tokens** from a VQ-VAE codebook that we distil from a strong monocular depth teacher, so a dense depth map becomes a short, discrete sequence.

The answer is then conditioned on the model's own spatial "sketch". You can think of it as a chain of thought made of masks and depth codes instead of words, and, because the tokens decode back into a mask and a depth map, it is one you can look at.

## Making depth tokens trainable

Generating long runs of depth codes is unstable if you only use the usual next-token loss. Two things helped:

- **Composite depth-token objectives**: a *marker*, a *token* and a *count* loss, used together;
- **Soft merging**, which makes depth reconstruction from the predicted tokens differentiable, so the model is also supervised on the depth map it implies.

The model is built on InternVL and co-trained on a mix of tasks, so the same perception tokens serve segmentation, spatial question answering and general VQA.

## Results

Compared with the strongest prior baselines reported in the paper:

| Benchmark | Gain |
|---|---|
| Referring segmentation, RefCOCO / RefCOCO+ / RefCOCOg (cIoU) | **+0.8 / +1.4 / +1.1** |
| HardBLINK spatial understanding (accuracy) | **+10.3%** |
| MMBench (accuracy) | **+1.0%** |

The HardBLINK jump is the result I care most about: it is the benchmark where "just look harder" does not work and explicit geometry does.

## What's next

I think explicit, inspectable intermediate perception is a good direction for spatial reasoning in multimodal models, and for world models more broadly. That is the line I want to keep pushing after my PhD.

This work was done during my internship at Amazon (Prime Video) with Amanmeet Garg, Shalini Chaudhuri, Rui Zhao and Garin Kessler. Thanks to all of them.
