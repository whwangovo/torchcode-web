"""Mixture of Experts (MoE) task."""

TASK = {
    "title": "Mixture of Experts (MoE)",
    "difficulty": "Hard",
    "function_name": "MixtureOfExperts",
    "hint": "Router: Linear(d, num_experts) -> topk -> softmax. Each expert: Linear->ReLU->Linear. Weighted sum of top-k expert outputs per token.",
    "tests": [
        {
            "name": "Output shape",
            "code": "\nimport torch, torch.nn as nn\nmoe = {fn}(d_model=32, d_ff=64, num_experts=4, top_k=2)\nassert isinstance(moe, nn.Module)\nout = moe(torch.randn(2, 8, 32))\nassert out.shape == (2, 8, 32), f'Shape: {out.shape}'\n"
        },
        {
            "name": "Has router and experts",
            "code": "\nimport torch, torch.nn as nn\nmoe = {fn}(d_model=32, d_ff=64, num_experts=4, top_k=2)\nassert hasattr(moe, 'router'), 'Need self.router'\nassert hasattr(moe, 'experts'), 'Need self.experts'\nassert len(moe.experts) == 4, f'Expected 4 experts, got {len(moe.experts)}'\n"
        },
        {
            "name": "Router logits shape",
            "code": "\nimport torch\nmoe = {fn}(d_model=16, d_ff=32, num_experts=8, top_k=2)\nlogits = moe.router(torch.randn(4, 16))\nassert logits.shape == (4, 8), f'Router output: {logits.shape}'\n"
        },
        {
            "name": "Gradient flow",
            "code": "\nimport torch\nmoe = {fn}(d_model=16, d_ff=32, num_experts=4, top_k=2)\nx = torch.randn(1, 4, 16, requires_grad=True)\nmoe(x).sum().backward()\nassert x.grad is not None, 'x.grad is None'\n"
        }
    ],
    "solution": '''class MixtureOfExperts(nn.Module):
    def __init__(self, d_model, d_ff, num_experts, top_k=2):
        super().__init__()
        self.top_k = top_k
        self.router = nn.Linear(d_model, num_experts)
        self.experts = nn.ModuleList([
            nn.Sequential(nn.Linear(d_model, d_ff), nn.ReLU(), nn.Linear(d_ff, d_model))
            for _ in range(num_experts)
        ])

    def forward(self, x):
        orig_shape = x.shape
        if x.dim() == 3:
            B, S, D = x.shape
            x_flat = x.reshape(-1, D)
        else:
            x_flat = x
        logits = self.router(x_flat)
        top_vals, top_idx = logits.topk(self.top_k, dim=-1)
        weights = torch.softmax(top_vals, dim=-1)
        output = torch.zeros_like(x_flat)
        for k in range(self.top_k):
            for e in range(len(self.experts)):
                mask = (top_idx[:, k] == e)
                if mask.any():
                    output[mask] += weights[mask, k:k+1] * self.experts[e](x_flat[mask])
        return output.reshape(orig_shape)''',
}