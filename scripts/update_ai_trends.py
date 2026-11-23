#!/usr/bin/env python3
"""Build static/ai-trends/data.json from Hugging Face Daily Papers.

Fetches the curated daily paper lists for the last DAYS days, normalises the
per-paper `ai_keywords`, scores each keyword by community attention
(papers weighted by upvotes) and keeps the leading papers per keyword.
Best-effort like update_scholar.py: on failure the committed file is kept.
Standard library only.
"""
import collections
import datetime
import json
import math
import pathlib
import re
import sys
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "static" / "ai-trends" / "data.json"
API = "https://huggingface.co/api/daily_papers?date={}&limit=100"
DAYS = 90
WINDOWS = (7, 30, 90)
MAX_WORDS = 150
MAX_PAPERS = 10

ALIASES = {
    "llm": "large language model", "llms": "large language model",
    "large language models (llms)": "large language model",
    "mllm": "multimodal large language model", "mllms": "multimodal large language model",
    "multimodal llm": "multimodal large language model", "multimodal llms": "multimodal large language model",
    "multi-modal large language model": "multimodal large language model",
    "vlm": "vision-language model", "vlms": "vision-language model",
    "vision language model": "vision-language model", "large vision-language model": "vision-language model",
    "lvlm": "vision-language model", "lvlms": "vision-language model",
    "vla": "vision-language-action model", "vlas": "vision-language-action model",
    "vision-language-action": "vision-language-action model",
    "rl": "reinforcement learning", "deep reinforcement learning": "reinforcement learning",
    "rlvr": "reinforcement learning with verifiable rewards",
    "reinforcement learning from verifiable rewards": "reinforcement learning with verifiable rewards",
    "rlhf": "reinforcement learning from human feedback",
    "3dgs": "3d gaussian splatting", "gaussian splatting": "3d gaussian splatting",
    "moe": "mixture of experts", "mixture-of-experts": "mixture of experts",
    "rag": "retrieval-augmented generation", "retrieval augmented generation": "retrieval-augmented generation",
    "cot": "chain-of-thought", "chain of thought": "chain-of-thought", "chain-of-thought reasoning": "chain-of-thought",
    "chain-of-thought (cot)": "chain-of-thought",
    "grpo": "group relative policy optimization",
    "dpo": "direct preference optimization",
    "nerf": "neural radiance field", "neural radiance fields": "neural radiance field",
    "dit": "diffusion transformer", "dits": "diffusion transformer",
    "lora": "low-rank adaptation",
    "t2i": "text-to-image generation", "text-to-image": "text-to-image generation",
    "t2v": "text-to-video generation", "text-to-video": "text-to-video generation",
    "sft": "supervised fine-tuning",
    "kv cache": "kv cache", "key-value cache": "kv cache",
    "mcp": "model context protocol",
    "llm agent": "llm agents", "language agent": "llm agents", "ai agent": "llm agents",
    "agent": "agents", "agentic": "agentic ai",
    "large language model agent": "llm agents", "llm based agent": "llm agents",
    "video generation model": "video generation", "image generation model": "image generation",
    "world action model": "world action model", "wam": "world action model", "wams": "world action model",
    "large reasoning model": "reasoning model", "lrm": "reasoning model", "lrms": "reasoning model",
    "language model": "large language model", "frontier llm": "large language model",
    "diffusion language model": "diffusion language model", "dllm": "diffusion language model",
    "dllms": "diffusion language model",
}
DISPLAY = {
    "large language model": "LLMs", "multimodal large language model": "MLLMs",
    "vision-language model": "VLMs", "vision-language-action model": "VLA models",
    "reinforcement learning with verifiable rewards": "RLVR",
    "reinforcement learning from human feedback": "RLHF",
    "3d gaussian splatting": "3D Gaussian Splatting", "mixture of experts": "Mixture of Experts",
    "retrieval-augmented generation": "RAG", "group relative policy optimization": "GRPO",
    "direct preference optimization": "DPO", "neural radiance field": "NeRF",
    "diffusion transformer": "Diffusion Transformer", "low-rank adaptation": "LoRA",
    "supervised fine-tuning": "SFT", "kv cache": "KV cache", "model context protocol": "MCP",
    "chain-of-thought": "Chain-of-Thought", "llm agents": "LLM agents",
}
STOP = {
    "state-of-the-art", "sota", "benchmark", "benchmarks", "baseline", "baselines", "dataset",
    "datasets", "model", "models", "framework", "performance", "efficiency", "scalability",
    "generalization", "robustness", "evaluation", "training", "inference", "accuracy",
    "fine-tuning", "pre-training", "pretraining", "post-training", "ablation studies", "open-source",
    "zero-shot", "end-to-end", "data", "experiments", "architecture", "deep learning",
    "machine learning", "neural networks", "neural network", "transformer", "transformers",
    "scaling", "latency", "throughput", "computational cost", "rollout", "policy", "backbone",
    "forward pass", "single forward pass", "validation loss", "trajectory", "trajectorie",
    "out-of-distribution", "prompt", "hidden state", "gradient descent", "pass@1", "pass@k",
    "cross-attention", "self-attention", "foundation model", "frontier model", "open-weight model",
    "adamw", "fid", "ablation", "downstream task", "inference cost", "loss function", "encoder",
    "decoder", "embedding", "hyperparameter", "convergence", "optimization", "supervision",
    "fine-tuned", "pretrained model", "large-scale dataset", "synthetic data", "annotation",
    "checkpoint", "base model", "coverage", "proposer", "critic", "model weight", "model scale",
    "feature space", "transformer block", "lightweight adapter", "training-free framework",
    "pareto frontier", "perplexity", "bf16", "learned policie", "policy model", "decision model",
}
CATEGORIES = [  # first match wins
    ("agents", r"agent|tool[- ]use|tool call|mcp|model context protocol|web navigation|\bgui\b|computer[- ]use|\bswe\b|software engineering|coding agent|harness|deep research"),
    ("robotics", r"robot|embodied|vision-language-action|\bvla|manipulation|locomotion|navigation|policy learning|sim-to-real|world[- ]action|autonomous driving"),
    ("3d", r"\b3d\b|3d |gaussian splat|nerf|radiance field|point cloud|depth|mesh|reconstruction|spatial|geometry|novel view|slam|4d"),
    ("llm", r"retrieval|rag\b|\bsft\b|supervised fine|instruction tun|pretrain|tokeniz"),
    ("generation", r"\bfid\b|diffusion|generat|text-to-|image editing|video editing|flow matching|denois|synthesis|autoregressive image|tokenizer|vae|world model"),
    ("multimodal", r"vision-language|multimodal|multi-modal|mllm|vlm|visual|video understanding|image|audio|speech|omni|ocr|document"),
    ("reasoning", r"reason|chain-of-thought|reinforcement learning|rlvr|grpo|policy optimization|reward|test-time|math|thinking|verif|self-improv|rlhf|preference|dpo"),
    ("efficiency", r"quantiz|pruning|distill|sparse|mixture of experts|kv cache|attention|long[- ]context|speculative|efficient|compression|low-rank|memory|lora|token"),
    ("safety", r"safety|alignment|jailbreak|hallucinat|attack|privacy|bias|watermark|red[- ]team|unlearning|detection|forensic|trust"),
    ("llm", r"language model|llm|pretrain|instruction|retrieval|rag|text|code|data|judge"),
    ("robotics", r"imitation learning|whole-body|libero|latent action|controller|humanoid"),
    ("efficiency", r"nvfp4|fp8|fp4|int4|gqa|vllm|sglang|throughput|time-to-first|inference engine|draft model|decod"),
    ("ml", r"learning|transformer|scaling law|muon|optimizer|representation|latent|probe|autoencoder|kl divergence|residual|embedding|distribution|forgetting|velocity field|adversarial|joint-embedding|adapter"),
]


def log(msg):
    print(f"[ai-trends] {msg}")


def fetch(day):
    req = urllib.request.Request(API.format(day), headers={"User-Agent": "liyc.uno ai-trends (+https://liyc.uno/ai-trends/)"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001
            if attempt == 3:
                raise
            log(f"{day}: {e}; retrying")
            time.sleep(2 + 3 * attempt)
    return []


def flat(s):
    s = re.sub(r"\([^)]*\)", " ", s.lower()).replace("-", " ").replace("_", " ")
    return re.sub(r"\s+", " ", s).strip()


ALIASES = {flat(a): flat(b) for a, b in ALIASES.items()}
DISPLAY = {flat(a): b for a, b in DISPLAY.items()}
STOP = {flat(w) for w in STOP}


def norm(kw):
    k = flat(kw) or kw.strip().lower()
    k = ALIASES.get(k, k)
    if k not in ALIASES.values() and not k.endswith(("ss", "is", "us")) and len(k) > 4 and k.endswith("s"):
        sing = k[:-3] + "y" if k.endswith("ies") else k[:-1]
        k = ALIASES.get(sing, sing)
    return k


def category(k):
    for name, pat in CATEGORIES:
        if re.search(pat, k) or re.search(pat, k.replace(" ", "-")):
            return name
    return "ml"


def main():
    today = datetime.date.today()
    papers, kw_papers, labels = {}, collections.defaultdict(set), collections.defaultdict(collections.Counter)
    for i in range(DAYS):
        day = (today - datetime.timedelta(days=i)).isoformat()
        try:
            items = fetch(day)
        except Exception as e:  # noqa: BLE001
            log(f"{day}: giving up ({e})")
            continue
        for it in items:
            p = it.get("paper") or {}
            pid = p.get("id")
            if not pid or pid in papers:
                continue
            kws = {}
            for raw in p.get("ai_keywords") or []:
                if not isinstance(raw, str) or len(raw) > 60:
                    continue
                k = norm(raw)
                if len(k) < 2 or k in STOP:
                    continue
                kws.setdefault(k, raw.strip())
            org = (it.get("organization") or p.get("organization") or {}).get("fullname") or ""
            papers[pid] = {
                "t": " ".join((p.get("title") or it.get("title") or "").split()),
                "u": int(p.get("upvotes") or 0),
                "d": day,
                "o": org,
                "g": p.get("githubRepo") or "",
                "s": " ".join((p.get("ai_summary") or "").split()),
                "a": [a.get("name") for a in (p.get("authors") or [])[:4] if a.get("name")],
                "na": len(p.get("authors") or []),
                "_k": list(kws),
            }
            for k, raw in kws.items():
                kw_papers[k].add(pid)
                labels[k][raw] += 1
        time.sleep(0.25)
    if len(papers) < 50:
        log(f"only {len(papers)} papers fetched; keeping existing file")
        return 0

    def weight(pid):
        return 1 + math.log2(1 + papers[pid]["u"])

    windows, used = {}, set()
    for w in WINDOWS:
        start = (today - datetime.timedelta(days=w - 1)).isoformat()
        days = sorted({p["d"] for p in papers.values() if p["d"] >= start})
        half = days[-max(len(days) // 3, 1)]  # latest third of the days that have papers
        tot_recent = sum(1 for p in papers.values() if p["d"] >= half) or 1
        tot_prev = sum(1 for p in papers.values() if start <= p["d"] < half) or 1
        rows = []
        for k, pids in kw_papers.items():
            ids = [pid for pid in pids if papers[pid]["d"] >= start]
            if len(ids) < (2 if w <= 7 else 3):
                continue
            score = sum(weight(pid) for pid in ids)
            recent = sum(1 for pid in ids if papers[pid]["d"] >= half)
            rise = (recent / tot_recent + 1e-3) / ((len(ids) - recent) / tot_prev + 1e-3)
            ids.sort(key=lambda pid: (-papers[pid]["u"], pid))
            label = DISPLAY.get(k) or labels[k].most_common(1)[0][0]
            rows.append({"k": k, "l": label, "c": category(k), "s": round(score, 1), "n": len(ids),
                         "r": round(rise, 2), "p": ids[:MAX_PAPERS]})
        rows.sort(key=lambda r: -r["s"])
        rows = rows[:MAX_WORDS]
        top = sorted((pid for pid, p in papers.items() if p["d"] >= start), key=lambda pid: -papers[pid]["u"])[:30]
        for r in rows:
            used.update(r["p"])
        used.update(top)
        windows[str(w)] = {"words": rows, "top": top, "papers": sum(1 for p in papers.values() if p["d"] >= start)}
    out = {
        "generated": today.isoformat(),
        "source": "Hugging Face Daily Papers",
        "windows": windows,
        "papers": {pid: {k: v for k, v in p.items() if k != "_k"} for pid, p in papers.items() if pid in used},
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n")
    log(f"{len(papers)} papers, {len(out['papers'])} kept, {OUT.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
