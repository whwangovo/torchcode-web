<p align="center">
  <h1 align="center">🔥 TorchCode Web</h1>
  <p align="center">
    从零实现 PyTorch 算子和模型架构——顶级 ML 团队面试中考察的核心技能。
    <br />
    <br />
    <a href="README.md">English</a> · <a href="https://github.com/whwangovo/torchcode-web/issues">报告 Bug</a> · <a href="https://github.com/whwangovo/torchcode-web/issues">功能建议</a>
  </p>
</p>

<p align="center">
  <a href="https://pytorch.org"><img src="https://img.shields.io/badge/PyTorch-ee4c2c?style=flat-square&logo=pytorch&logoColor=white" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" /></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" /></a>
  <img src="https://img.shields.io/badge/题目数量-40-orange?style=flat-square" />
</p>

---

## 这是什么？

一个自托管的 PyTorch 编程练习平台。在浏览器内置的 Monaco 编辑器中编写实现，提交后由本地评测服务执行测试用例，并可与参考答案对比。

40 道精选题目，3 个难度等级——从 ReLU 到 Flash Attention。

### 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | Next.js + Monaco Editor + Tailwind CSS |
| 后端 | FastAPI 评测服务 |
| 评测引擎 | [torch_judge](https://github.com/duoan/TorchCode) — 执行并验证提交的代码 |
| 存储 | SQLite（进度追踪） |

---

## 快速开始

### 环境要求

- Python 3.11+
- Node.js 18+
- 已安装 PyTorch 的 conda/venv 环境

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/whwangovo/torchcode-web.git
cd torchcode-web

# 2. 安装 Python 依赖
pip install fastapi uvicorn torch pydantic
pip install -e .

# 3. 安装 Node 依赖
npm install
cd web && npm install && cd ..

# 4. 启动
npm run dev
```

启动后：
- **评测服务** → `http://localhost:8000`
- **Web 界面** → `http://localhost:3000`

---

## 题目列表

<details>
<summary><b>简单（9 题）</b></summary>

ReLU · Softmax · Dropout · Embedding · GELU · 交叉熵 · 梯度裁剪 · 梯度累积 · Kaiming 初始化

</details>

<details>
<summary><b>中等（15 题）</b></summary>

Linear · LayerNorm · BatchNorm · RMSNorm · MLP · Attention · Conv2D · Adam · LoRA · ViT Patch · 束搜索 · Top-k 采样 · 余弦学习率 · 线性回归

</details>

<details>
<summary><b>困难（16 题）</b></summary>

多头注意力 · Flash Attention · GQA · KV Cache · RoPE · 因果注意力 · GPT-2 Block · MoE · BPE · 推测解码 · DPO Loss · GRPO Loss · PPO Loss · INT8 量化

</details>

---

## 配置

| 环境变量 | 默认值 | 说明 |
|---|---|---|
| `GRADING_SERVICE_URL` | `http://localhost:8000` | 评测服务地址 |
| `DB_PATH` | `./data/torchcode.db` | 进度追踪用 SQLite 数据库路径 |

在 `web/.env.local` 中设置以覆盖默认值。

---

## 项目结构

```
torchcode-web/
├── web/                  # Next.js 前端
│   ├── src/app/          # 页面和 API 路由
│   ├── src/components/   # UI 组件
│   └── src/lib/          # 工具函数、题目数据
├── grading_service/      # FastAPI 后端
├── torch_judge/          # 评测引擎（题目定义 + 测试运行器）
└── package.json          # 开发脚本（同时启动前后端）
```

---

## 致谢

题库和评测引擎基于 [duoan](https://github.com/duoan) 的 [TorchCode](https://github.com/duoan/TorchCode)，遵循 MIT 协议。

本项目在原版基础上新增了 Web 前端和 REST 评测服务，作为原 Jupyter 界面的替代方案。

---

## 许可证

本项目基于 MIT 许可证分发。详见 [LICENSE](LICENSE)。
