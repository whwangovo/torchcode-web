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

40 curated problems across 3 difficulty levels — from ReLU to Flash Attention.

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
- PyTorch installed (`pip install torch` or via [pytorch.org](https://pytorch.org/get-started/locally/))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/whwangovo/torchcode-web.git
cd torchcode-web

# 2. Install dependencies
pip install -e .
npm install

# 3. Run
npm run dev
```

This starts:

- **Grading service** → `http://localhost:8000`
- **Web app** → `http://localhost:3000`

---

## Problem Set

<details>
<summary><b>Easy (9 problems)</b></summary>

ReLU · Softmax · Dropout · Embedding · GELU · Cross Entropy · Gradient Clipping · Gradient Accumulation · Kaiming Init

</details>

<details>
<summary><b>Medium (15 problems)</b></summary>

Linear · LayerNorm · BatchNorm · RMSNorm · MLP · Attention · Conv2D · Adam · LoRA · ViT Patch · Beam Search · Top-k Sampling · Cosine LR · Linear Regression

</details>

<details>
<summary><b>Hard (16 problems)</b></summary>

Multi-Head Attention · Flash Attention · GQA · KV Cache · RoPE · Causal Attention · GPT-2 Block · MoE · BPE · Speculative Decoding · DPO Loss · GRPO Loss · PPO Loss · INT8 Quantization

</details>

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
