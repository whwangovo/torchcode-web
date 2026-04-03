[中文版 README](README_CN.md) | English

# TorchCode Web

Practice implementing PyTorch operators and architectures from scratch — the exact skills top ML teams test for.

40 problems. Instant feedback. No Docker required.

[![PyTorch](https://img.shields.io/badge/PyTorch-ee4c2c?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
![Problems](https://img.shields.io/badge/problems-40-orange?style=flat-square)

---

## Overview

TorchCode is a self-hosted coding practice platform for PyTorch. Write implementations in a browser-based editor, run test cases against a local grading service, and compare your solution against a reference implementation.

**Stack:**
- **Frontend** — Next.js web app with Monaco editor
- **Backend** — FastAPI grading service that executes and tests submitted code
- **Problems** — 40 curated PyTorch problems across 3 difficulty levels

---

## Quick Start

**Prerequisites:** Python 3.11+, Node.js 18+, and a conda/venv environment with PyTorch installed.

**1. Install Python dependencies**

```bash
pip install fastapi uvicorn torch pydantic
pip install -e .
```

**2. Install Node dependencies**

```bash
npm install
cd web && npm install
```

**3. Run**

```bash
npm run dev
```

This starts:
- Grading service at `http://localhost:8000`
- Web app at `http://localhost:3000`

---

## Problem Set

| Difficulty | Count | Topics |
|---|---|---|
| Easy | 9 | ReLU, Softmax, Dropout, Embedding, GELU, CrossEntropy, Gradient Clipping, Gradient Accumulation, Kaiming Init |
| Medium | 15 | Linear, LayerNorm, BatchNorm, RMSNorm, MLP, Attention, Conv2D, Adam, LoRA, ViT Patch, Beam Search, Top-k Sampling, Cosine LR, Linear Regression |
| Hard | 16 | Multi-Head Attention, Flash Attention, GQA, KV Cache, RoPE, Causal Attention, GPT-2 Block, MoE, BPE, Speculative Decoding, DPO/GRPO/PPO Loss, INT8 Quantization |

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `GRADING_SERVICE_URL` | `http://localhost:8000` | URL of the grading service |
| `DB_PATH` | `./data/torchcode.db` | SQLite database path for progress tracking |

Set these in `web/.env.local` to override.

---

## Credits

Problem set and judge engine based on [TorchCode](https://github.com/duoan/TorchCode) by [duoan](https://github.com/duoan), licensed under MIT.

This fork adds a web frontend and REST grading service as an alternative to the original Jupyter-based interface.
