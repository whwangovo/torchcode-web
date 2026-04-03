"""2D Convolution task."""

TASK = {
    "title": "2D Convolution",
    "difficulty": "Medium",
    "function_name": "my_conv2d",
    "hint": "Extract patches using unfold or nested loops. For each output position, sum(patch * kernel). Support stride and padding (zero-pad with F.pad).",
    "tests": [
        {
            "name": "Output shape",
            "code": "\nimport torch\nx = torch.randn(1, 3, 8, 8)\nw = torch.randn(16, 3, 3, 3)\nout = {fn}(x, w)\nassert out.shape == (1, 16, 6, 6), f'Shape: {out.shape}'\n"
        },
        {
            "name": "Matches F.conv2d",
            "code": "\nimport torch\ntorch.manual_seed(0)\nx = torch.randn(2, 3, 8, 8)\nw = torch.randn(4, 3, 3, 3)\nb = torch.randn(4)\nout = {fn}(x, w, b)\nref = torch.nn.functional.conv2d(x, w, b)\nassert torch.allclose(out, ref, atol=1e-4), f'Max diff: {(out-ref).abs().max():.6f}'\n"
        },
        {
            "name": "With padding",
            "code": "\nimport torch\ntorch.manual_seed(0)\nx = torch.randn(1, 1, 5, 5)\nw = torch.randn(1, 1, 3, 3)\nout = {fn}(x, w, padding=1)\nref = torch.nn.functional.conv2d(x, w, padding=1)\nassert out.shape == ref.shape and torch.allclose(out, ref, atol=1e-4), 'Padding mismatch'\n"
        },
        {
            "name": "With stride",
            "code": "\nimport torch\ntorch.manual_seed(0)\nx = torch.randn(1, 1, 8, 8)\nw = torch.randn(1, 1, 3, 3)\nout = {fn}(x, w, stride=2)\nref = torch.nn.functional.conv2d(x, w, stride=2)\nassert out.shape == ref.shape and torch.allclose(out, ref, atol=1e-4), 'Stride mismatch'\n"
        },
        {
            "name": "Gradient flow",
            "code": "\nimport torch\nx = torch.randn(1, 1, 4, 4, requires_grad=True)\nw = torch.randn(2, 1, 3, 3, requires_grad=True)\n{fn}(x, w).sum().backward()\nassert x.grad is not None and w.grad is not None, 'Missing gradients'\n"
        }
    ]
    "solution": "def my_conv2d(x, weight, bias=None, stride=1, padding=0):
    if padding > 0:
        x = F.pad(x, [padding] * 4)
    B, C_in, H, W = x.shape
    C_out, _, kH, kW = weight.shape
    H_out = (H - kH) // stride + 1
    W_out = (W - kW) // stride + 1
    patches = x.unfold(2, kH, stride).unfold(3, kW, stride)
    out = torch.einsum('bihwjk,oijk->bohw', patches, weight)
    if bias is not None:
        out = out + bias.view(1, -1, 1, 1)
    return out",
}