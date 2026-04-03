"""Simple Linear Layer task."""

TASK = {
    "title": "Simple Linear Layer",
    "difficulty": "Medium",
    "function_name": "SimpleLinear",
    "hint": "y = x @ W^T + b. Initialize weight with Kaiming scaling: randn * (1/sqrt(in_features)).",
    "tests": [
        {
            "name": "Weight & bias shape",
            "code": """
import torch
layer = {fn}(8, 4)
assert layer.weight.shape == (4, 8), f'Weight shape: {layer.weight.shape}'
assert layer.bias.shape == (4,), f'Bias shape: {layer.bias.shape}'
assert layer.weight.requires_grad, 'weight must require grad'
assert layer.bias.requires_grad, 'bias must require grad'
""",
        },
        {
            "name": "Forward pass",
            "code": """
import torch
layer = {fn}(8, 4)
x = torch.randn(2, 8)
y = layer.forward(x)
assert y.shape == (2, 4), f'Output shape: {y.shape}'
expected = x @ layer.weight.T + layer.bias
assert torch.allclose(y, expected, atol=1e-5), 'Forward != x @ W^T + b'
""",
        },
        {
            "name": "Gradient flow",
            "code": """
import torch
layer = {fn}(8, 4)
x = torch.randn(2, 8)
y = layer.forward(x)
y.sum().backward()
assert layer.weight.grad is not None, 'weight.grad is None'
assert layer.bias.grad is not None, 'bias.grad is None'
""",
        },
    ],
    "solution": "class SimpleLinear:
    def __init__(self, in_features: int, out_features: int):
        self.weight = torch.randn(out_features, in_features) * (1 / math.sqrt(in_features))
        self.weight.requires_grad_(True)
        self.bias = torch.zeros(out_features, requires_grad=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x @ self.weight.T + self.bias",
}