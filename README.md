<p align="center">
  <h1 align="center">🔥 TorchCode Web</h1>
  <p align="center">
    Practice implementing PyTorch operators and architectures from scratch.
    <br />
    The exact skills top ML teams test for.
	<br />
    <a href="README_CN.md">中文</a>
  </p>
</p>

---

## What is TorchCode Web?

A self-hosted coding practice platform for PyTorch. Write implementations in a browser-based Monaco editor, run test cases against a local grading service, and compare your solution with the reference.

40 curated problems across 3 difficulty levels — from ReLU to Flash Attention. No GPU required.

### Features

- **Browser-based editor** — Monaco editor with Python syntax highlighting, no IDE setup needed
- **Instant feedback** — submit code and get test results in seconds
- **Reference solutions** — compare your implementation against a working solution
- **Progress tracking** — pick up where you left off across sessions
- **Fully local** — all code execution happens on your machine, nothing sent to the cloud

### Tech Stack

| Layer        | Technology                                                                           |
| ------------ | ------------------------------------------------------------------------------------ |
| Frontend     | Next.js + Monaco Editor + Tailwind CSS                                               |
| Backend      | FastAPI grading service                                                              |
| Judge Engine | [torch_judge](https://github.com/duoan/TorchCode) — executes and validates submissions |
| Storage      | SQLite (progress tracking)                                                           |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Installation

**Option A — one-liner (recommended)**

```bash
git clone https://github.com/whwangovo/torchcode-web.git
cd torchcode-web
./setup.sh
npm run dev
```

`setup.sh` automatically creates and activates a Python environment (prefers `uv` → `conda` → `venv`), installs all dependencies, then prints the start command.

**Option B — manual**

```bash
git clone https://github.com/whwangovo/torchcode-web.git
cd torchcode-web

# create & activate your preferred Python env, e.g.:
conda create -n torchcode python=3.11 -y && conda activate torchcode
# or: python3 -m venv .venv && source .venv/bin/activate

pip install -e .   # or: uv pip install -e .
npm install
npm run dev
```

Either way, once running:

- **Grading service** → `http://localhost:8000`
- **Web app** → `http://localhost:3000`

---

## Problem Set

40 problems organized by category:

| Category | Problems |
|---|---|
| **Fundamentals** | ReLU, Softmax, GELU, Dropout, Embedding, Cross Entropy, Linear, Kaiming Init, Linear Regression |
| **Normalization** | LayerNorm, BatchNorm, RMSNorm |
| **Attention** | Scaled Dot-Product Attention, Multi-Head Attention, Causal Attention, Cross Attention, GQA, Sliding Window, Linear Attention, Flash Attention |
| **Architecture** | MLP, GPT-2 Block, KV Cache, RoPE, Conv2D, LoRA, ViT Patch, MoE |
| **Training & Optimization** | Adam, Cosine LR, Gradient Clipping, Gradient Accumulation |
| **Inference** | Top-k Sampling, Beam Search, Speculative Decoding, BPE Tokenization |
| **Advanced** | INT8 Quantization, DPO Loss, GRPO Loss, PPO Loss |

### Suggested Study Plan

| Week | Focus | Time |
|---|---|---|
| 1 | Fundamentals + Normalization (12 problems) | ~4 hrs |
| 2 | Attention mechanisms (7 problems) | ~4 hrs |
| 3 | Architecture + Training (12 problems) | ~5 hrs |
| 4 | Inference + Advanced (9 problems) | ~4 hrs |

---

## Configuration

| Variable                | Default                   | Description                           |
| ----------------------- | ------------------------- | ------------------------------------- |
| `GRADING_SERVICE_URL` | `http://localhost:8000` | Grading service URL                   |
| `DB_PATH`             | `./data/torchcode.db`   | SQLite database for progress tracking |

Set in `web/.env.local` to override.

---

## Project Structure

```
torchcode-web/
├── web/                  # Next.js frontend
│   ├── src/app/          # Pages and API routes
│   ├── src/components/   # UI components
│   └── src/lib/          # Utilities, problem data
├── grading_service/      # FastAPI backend
├── torch_judge/          # Judge engine (problem definitions + test runner)
└── package.json          # Dev scripts (runs frontend + backend concurrently)
```

---

## Acknowledgements

Problem set and judge engine based on [TorchCode](https://github.com/duoan/TorchCode) by [duoan](https://github.com/duoan), licensed under MIT.

This project adds a web frontend and REST grading service as an alternative to the original Jupyter-based interface.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
