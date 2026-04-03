"""LoRA (Low-Rank Adaptation) task."""

TASK = {
    "title": "LoRA (Low-Rank Adaptation)",
    "difficulty": "Medium",
    "function_name": "LoRALinear",
    "hint": "Freeze base linear. Add lora_A (rank, in) and lora_B (out, rank) as Parameters. B init to zeros. output = linear(x) + (x @ A^T @ B^T) * (alpha/rank).",
    "tests": [
        {
            "name": "Base weights frozen",
            "code": "\nimport torch, torch.nn as nn\nlayer = {fn}(in_features=16, out_features=8, rank=4)\nassert isinstance(layer, nn.Module)\nassert not layer.linear.weight.requires_grad, 'Base weight must be frozen'\nassert not layer.linear.bias.requires_grad, 'Base bias must be frozen'\n"
        },
        {
            "name": "LoRA parameter shapes",
            "code": "\nimport torch\nlayer = {fn}(in_features=16, out_features=8, rank=4)\nassert layer.lora_A.shape == (4, 16), f'lora_A: {layer.lora_A.shape}'\nassert layer.lora_B.shape == (8, 4), f'lora_B: {layer.lora_B.shape}'\n"
        },
        {
            "name": "B=0 means output equals base",
            "code": "\nimport torch\ntorch.manual_seed(0)\nlayer = {fn}(in_features=8, out_features=4, rank=2)\nx = torch.randn(2, 8)\nassert torch.allclose(layer(x), layer.linear(x), atol=1e-5), 'With B=0, should equal base'\n"
        },
        {
            "name": "Only LoRA params get gradients",
            "code": "\nimport torch\nlayer = {fn}(in_features=8, out_features=4, rank=2)\nlayer(torch.randn(2, 8)).sum().backward()\nassert layer.lora_A.grad is not None, 'lora_A.grad is None'\nassert layer.lora_B.grad is not None, 'lora_B.grad is None'\nassert layer.linear.weight.grad is None, 'Base weight should not have grad'\n"
        },
        {
            "name": "Forward computation",
            "code": "\nimport torch\ntorch.manual_seed(0)\nlayer = {fn}(in_features=8, out_features=4, rank=2, alpha=2.0)\nlayer.lora_B.data.normal_()\nx = torch.randn(3, 8)\nref = layer.linear(x) + (x @ layer.lora_A.T @ layer.lora_B.T) * (2.0 / 2)\nassert torch.allclose(layer(x), ref, atol=1e-5), 'Forward mismatch'\n"
        }
    ],
    "solution": '''class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, rank, alpha=1.0):
        super().__init__()
        self.linear = nn.Linear(in_features, out_features)
        self.linear.weight.requires_grad_(False)
        self.linear.bias.requires_grad_(False)
        self.lora_A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))
        self.scaling = alpha / rank

    def forward(self, x):
        return self.linear(x) + (x @ self.lora_A.T @ self.lora_B.T) * self.scaling''',
}