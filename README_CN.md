<p align="center">
  <h1 align="center">🔥 TorchCode Web</h1>
  <p align="center">
    从零实现 PyTorch 算子和模型架构——顶级 ML 团队面试中考察的核心技能。
    <br />
    <br />
    <a href="README.md">English</a>
  </p>
</p>

---

## 这是什么？

一个自托管的 PyTorch 编程练习平台。在浏览器内置的 Monaco 编辑器中编写实现，提交后由本地评测服务执行测试用例，并可与参考答案对比。

40 道精选题目，3 个难度等级——从 ReLU 到 Flash Attention。无需 GPU。

### 特性

- **浏览器编辑器** — Monaco 编辑器，Python 语法高亮，无需配置 IDE
- **即时反馈** — 提交代码后秒级返回测试结果
- **参考答案** — 与标准实现对比你的方案
- **进度追踪** — 跨会话保存进度，随时继续
- **完全本地** — 所有代码在本机执行，不上传任何数据

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

### 安装

```bash
git clone https://github.com/whwangovo/torchcode-web.git
cd torchcode-web
./setup.sh
npm run dev
```

`setup.sh` 安装 Python 依赖（优先使用 `uv`，否则回退到 `pip`）和 Node 依赖。`npm run dev` 同时启动前后端。

- **评测服务** → `http://localhost:8000`
- **Web 界面** → `http://localhost:3000`

> **注意：** 运行 `setup.sh` 前请先激活 Python 环境。推荐使用 [uv](https://github.com/astral-sh/uv) 加速安装。

---

## 题目列表

40 道题目，按类别分组：

| 类别 | 题目 |
|---|---|
| **基础** | ReLU、Softmax、GELU、Dropout、Embedding、交叉熵、Linear、Kaiming 初始化、线性回归 |
| **归一化** | LayerNorm、BatchNorm、RMSNorm |
| **注意力** | 缩放点积注意力、多头注意力、因果注意力、交叉注意力、GQA、滑动窗口、线性注意力、Flash Attention |
| **架构** | MLP、GPT-2 Block、KV Cache、RoPE、Conv2D、LoRA、ViT Patch、MoE |
| **训练与优化** | Adam、余弦学习率、梯度裁剪、梯度累积 |
| **推理** | Top-k 采样、束搜索、推测解码、BPE 分词 |
| **进阶** | INT8 量化、DPO Loss、GRPO Loss、PPO Loss |

### 建议学习计划

| 周次 | 重点 | 预计时间 |
|---|---|---|
| 第 1 周 | 基础 + 归一化（12 题） | ~4 小时 |
| 第 2 周 | 注意力机制（7 题） | ~4 小时 |
| 第 3 周 | 架构 + 训练（12 题） | ~5 小时 |
| 第 4 周 | 推理 + 进阶（9 题） | ~4 小时 |

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
