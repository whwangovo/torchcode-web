"""Multi-Head Cross-Attention task."""

TASK = {
    "title": "Multi-Head Cross-Attention",
    "difficulty": "Medium",
    "function_name": "MultiHeadCrossAttention",
    "hint": "Q from decoder (x_q), K/V from encoder (x_kv). Project, reshape to multi-head, compute scaled dot-product attention (no causal mask). Concat heads and project output.",
    "tests": [
        {
            "name": "Output shape",
            "code": "\nimport torch, torch.nn as nn\nattn = {fn}(d_model=64, num_heads=4)\nassert isinstance(attn, nn.Module), 'Must inherit from nn.Module'\nout = attn(torch.randn(2, 6, 64), torch.randn(2, 10, 64))\nassert out.shape == (2, 6, 64), f'Output shape: {out.shape}'\n"
        },
        {
            "name": "Q and KV different lengths",
            "code": "\nimport torch\nattn = {fn}(d_model=32, num_heads=2)\nout = attn(torch.randn(1, 3, 32), torch.randn(1, 20, 32))\nassert out.shape == (1, 3, 32), f'Shape: {out.shape}'\n"
        },
        {
            "name": "No causal mask \u2014 all KV affects all Q",
            "code": "\nimport torch\ntorch.manual_seed(0)\nattn = {fn}(d_model=32, num_heads=2)\nx_q = torch.randn(1, 4, 32)\nx_kv = torch.randn(1, 6, 32)\nout1 = attn(x_q, x_kv)\nx_kv2 = x_kv.clone()\nx_kv2[:, -1] = torch.randn(1, 32)\nout2 = attn(x_q, x_kv2)\nassert not torch.allclose(out1[:, 0], out2[:, 0], atol=1e-5), 'Changing last KV should affect all Q positions'\n"
        },
        {
            "name": "Gradient flow",
            "code": "\nimport torch\nattn = {fn}(d_model=32, num_heads=2)\nx_q = torch.randn(1, 4, 32, requires_grad=True)\nx_kv = torch.randn(1, 6, 32, requires_grad=True)\nattn(x_q, x_kv).sum().backward()\nassert x_q.grad is not None and x_kv.grad is not None, 'Missing gradients'\n"
        }
    ],
    "solution": '''class MultiHeadCrossAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x_q, x_kv):
        B, S_q, _ = x_q.shape
        S_kv = x_kv.shape[1]
        q = self.W_q(x_q).view(B, S_q, self.num_heads, self.d_k).transpose(1, 2)
        k = self.W_k(x_kv).view(B, S_kv, self.num_heads, self.d_k).transpose(1, 2)
        v = self.W_v(x_kv).view(B, S_kv, self.num_heads, self.d_k).transpose(1, 2)
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        weights = torch.softmax(scores, dim=-1)
        attn = torch.matmul(weights, v)
        return self.W_o(attn.transpose(1, 2).contiguous().view(B, S_q, -1))''',
}