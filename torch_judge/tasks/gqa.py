"""Grouped Query Attention task."""

TASK = {
    "title": "Grouped Query Attention",
    "difficulty": "Hard",
    "function_name": "GroupQueryAttention",
    "hint": "Like MHA but fewer KV heads. W_k/W_v project to num_kv_heads * d_k dims. Use repeat_interleave to expand KV heads to match Q heads.",
    "tests": [
        {
            "name": "Output shape",
            "code": """
import torch
torch.manual_seed(0)
gqa = {fn}(d_model=32, num_heads=8, num_kv_heads=2)
out = gqa.forward(torch.randn(2, 6, 32))
assert out.shape == (2, 6, 32), f'Shape mismatch: {out.shape}'
""",
        },
        {
            "name": "nn.Linear with correct shapes",
            "code": """
import torch, torch.nn as nn
gqa = {fn}(d_model=32, num_heads=8, num_kv_heads=2)
d_k = 32 // 8
assert isinstance(gqa.W_q, nn.Linear) and gqa.W_q.weight.shape == (32, 32), f'W_q wrong'
assert isinstance(gqa.W_k, nn.Linear) and gqa.W_k.weight.shape == (2 * d_k, 32), f'W_k shape: {gqa.W_k.weight.shape}'
assert isinstance(gqa.W_v, nn.Linear) and gqa.W_v.weight.shape == (2 * d_k, 32), f'W_v shape: {gqa.W_v.weight.shape}'
assert isinstance(gqa.W_o, nn.Linear), 'W_o should be nn.Linear'
""",
        },
        {
            "name": "Degenerates to MHA when kv_heads == heads",
            "code": """
import torch
torch.manual_seed(42)
gqa = {fn}(d_model=16, num_heads=4, num_kv_heads=4)
out = gqa.forward(torch.randn(1, 4, 16))
assert out.shape == (1, 4, 16)
assert gqa.W_k.weight.shape == (16, 16), 'Full KV when kv_heads == heads'
""",
        },
        {
            "name": "KV heads are shared correctly",
            "code": """
import torch
torch.manual_seed(0)
D, H, KV = 16, 4, 2
d_k = D // H
gqa = {fn}(d_model=D, num_heads=H, num_kv_heads=KV)
x = torch.randn(1, 4, D)
k = gqa.W_k(x).view(1, 4, KV, d_k).transpose(1, 2)
k_exp = k.repeat_interleave(H // KV, dim=1)
assert torch.equal(k_exp[:, 0], k_exp[:, 1]), 'Heads 0,1 should share same K'
assert not torch.equal(k_exp[:, 0], k_exp[:, 2]), 'Different groups need different K'
""",
        },
        {
            "name": "Gradient flow",
            "code": """
import torch
torch.manual_seed(0)
gqa = {fn}(d_model=16, num_heads=4, num_kv_heads=2)
x = torch.randn(1, 4, 16, requires_grad=True)
gqa.forward(x).sum().backward()
assert x.grad is not None, 'x.grad is None'
assert gqa.W_q.weight.grad is not None and gqa.W_k.weight.grad is not None, 'Missing weight gradients'
""",
        },
    ],
    "solution": "class GroupQueryAttention:
    def __init__(self, d_model, num_heads, num_kv_heads):
        self.num_heads = num_heads
        self.num_kv_heads = num_kv_heads
        self.d_k = d_model // num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, num_kv_heads * self.d_k)
        self.W_v = nn.Linear(d_model, num_kv_heads * self.d_k)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x):
        B, S, _ = x.shape
        q = self.W_q(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)
        k = self.W_k(x).view(B, S, self.num_kv_heads, self.d_k).transpose(1, 2)
        v = self.W_v(x).view(B, S, self.num_kv_heads, self.d_k).transpose(1, 2)
        repeats = self.num_heads // self.num_kv_heads
        k = k.repeat_interleave(repeats, dim=1)
        v = v.repeat_interleave(repeats, dim=1)
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        weights = torch.softmax(scores, dim=-1)
        attn = torch.matmul(weights, v)
        out = attn.transpose(1, 2).contiguous().view(B, S, -1)
        return self.W_o(out)",
}