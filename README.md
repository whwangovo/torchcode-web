<p align="center">
  <h1 align="center">🔥 TorchCode Web</h1>
  <p align="center">
    Practice implementing PyTorch operators and architectures from scratch.
    <br />
    The exact skills top ML teams test for.
    <br />
    <br />
    <a href="README_CN.md">中文</a> · <a href="https://github.com/whwangovo/torchcode-web/issues">Report Bug</a> · <a href="https://github.com/whwangovo/torchcode-web/issues">Request Feature</a>
  </p>
</p>

<p align="center">
  <a href="https://pytorch.org"><img src="https://img.shields.io/badge/PyTorch-ee4c2c?style=flat-square&logo=pytorch&logoColor=white" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" /></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" /></a>
  <img src="https://img.shields.io/badge/problems-40-orange?style=flat-square" />
</p>

---

## What is TorchCode Web?

A self-hosted coding practice platform for PyTorch. Write implementations in a browser-based Monaco editor, run test cases against a local grading service, and compare your solution with the reference.

40 curated problems across 3 difficulty levels — from ReLU to Flash Attention.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + Monaco Editor + Tailwind CSS |
| Backend | FastAPI grading service |
| Judge Engine | [torch_judge](https://github.com/duoan/TorchCode) — executes and validates submissions |
| Storage | SQLite (progress tracking) |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PyTorch installed in a conda/venv environment

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/whwangovo/torchcode-web.git
cd torchcode-web

# 2. Install Python dependencies
pip install fastapi uvicorn torch pydantic
pip install -e .

# 3. Install Node dependencies
npm install
cd web && npm install && cd ..

# 4. Run
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

| Variable | Default | Description |
|---|---|---|
| `GRADING_SERVICE_URL` | `http://localhost:8000` | Grading service URL |
| `DB_PATH` | `./data/torchcode.db` | SQLite database for progress tracking |

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

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Acknowledgements

Problem set and judge engine based on [TorchCode](https://github.com/duoan/TorchCode) by [duoan](https://github.com/duoan), licensed under MIT.

This project adds a web frontend and REST grading service as an alternative to the original Jupyter-based interface.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
