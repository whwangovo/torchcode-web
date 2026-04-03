"""Rotary Position Embedding (RoPE) task."""

TASK = {
    "title": "Rotary Position Embedding (RoPE)",
    "difficulty": "Hard",
    "function_name": "apply_rope",
    "hint": "Split into pairs (x_even, x_odd). Compute angles = pos * 1/(10000^(2i/d)). Rotate: [x_e*cos - x_o*sin, x_e*sin + x_o*cos]. Stack and flatten.",
    "tests": [
        {
            "name": "Output shapes",
            "code": "\nimport torch\nq = torch.randn(2, 8, 64)\nk = torch.randn(2, 8, 64)\nq_rot, k_rot = {fn}(q, k)\nassert q_rot.shape == q.shape, f'Q shape: {q_rot.shape}'\nassert k_rot.shape == k.shape, f'K shape: {k_rot.shape}'\n"
        },
        {
            "name": "Preserves norm",
            "code": "\nimport torch\ntorch.manual_seed(0)\nq = torch.randn(1, 16, 32)\nk = torch.randn(1, 16, 32)\nq_rot, k_rot = {fn}(q, k)\nassert torch.allclose(q.norm(dim=-1), q_rot.norm(dim=-1), atol=1e-4), 'RoPE should preserve norms'\n"
        },
        {
            "name": "Relative position property",
            "code": "\nimport torch\ntorch.manual_seed(0)\nq = torch.randn(1, 8, 16)\nk = torch.randn(1, 8, 16)\nq_rot, k_rot = {fn}(q, k)\nq2 = torch.cat([torch.zeros(1, 3, 16), q], dim=1)\nk2 = torch.cat([torch.zeros(1, 3, 16), k], dim=1)\nq2_rot, k2_rot = {fn}(q2, k2)\ndot1 = (q_rot[:, 0] * k_rot[:, 0]).sum(dim=-1)\ndot2 = (q2_rot[:, 3] * k2_rot[:, 3]).sum(dim=-1)\nassert torch.allclose(dot1, dot2, atol=1e-4), 'Dot product should depend on relative position only'\n"
        },
        {
            "name": "Gradient flow",
            "code": "\nimport torch\nq = torch.randn(1, 4, 8, requires_grad=True)\nk = torch.randn(1, 4, 8, requires_grad=True)\nqr, kr = {fn}(q, k)\n(qr.sum() + kr.sum()).backward()\nassert q.grad is not None and k.grad is not None, 'Missing gradients'\n"
        }
    ],
    "solution": '''def apply_rope(q, k):
    B, S, D = q.shape
    pos = torch.arange(S, device=q.device).unsqueeze(1).float()
    dim = torch.arange(0, D, 2, device=q.device).float()
    freqs = 1.0 / (10000.0 ** (dim / D))
    angles = pos * freqs
    cos_a = torch.cos(angles)
    sin_a = torch.sin(angles)

    def rotate(x):
        x1, x2 = x[..., 0::2], x[..., 1::2]
        return torch.stack([x1 * cos_a - x2 * sin_a,
                            x1 * sin_a + x2 * cos_a], dim=-1).flatten(-2)

    return rotate(q), rotate(k)''',
}