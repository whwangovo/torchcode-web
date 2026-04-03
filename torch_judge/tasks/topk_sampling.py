"""Top-k / Top-p Sampling task."""

TASK = {
    "title": "Top-k / Top-p Sampling",
    "difficulty": "Medium",
    "function_name": "sample_top_k_top_p",
    "hint": "Apply temperature first. For top-k: set logits below the k-th largest to -inf. For top-p: sort, compute cumsum of probs, mask where cumsum > p. Then sample from softmax.",
    "tests": [
        {
            "name": "top_k=1 always returns argmax",
            "code": "\nimport torch\ntorch.manual_seed(0)\nlogits = torch.tensor([1.0, 5.0, 2.0, 0.5])\nfor _ in range(10):\n    assert {fn}(logits.clone(), top_k=1) == 1, 'top_k=1 should return argmax'\n"
        },
        {
            "name": "Low temperature concentrates",
            "code": "\nimport torch\ntorch.manual_seed(42)\nlogits = torch.tensor([1.0, 3.0, 2.0])\ncounts = [0, 0, 0]\nfor _ in range(100):\n    counts[{fn}(logits.clone(), temperature=0.01)] += 1\nassert counts[1] > 90, f'Low temp should pick argmax, got {counts}'\n"
        },
        {
            "name": "All tokens reachable (no filtering)",
            "code": "\nimport torch\nlogits = torch.zeros(5)\nseen = set()\nfor i in range(200):\n    torch.manual_seed(i)\n    seen.add({fn}(logits.clone()))\nassert len(seen) == 5, f'Only saw {seen}'\n"
        },
        {
            "name": "Returns valid index",
            "code": "\nimport torch\ntorch.manual_seed(0)\nV = 100\nlogits = torch.randn(V)\nfor _ in range(20):\n    t = {fn}(logits.clone(), top_k=10, top_p=0.9)\n    assert 0 <= t < V, f'Token {t} out of range'\n"
        }
    ]
    "solution": "def sample_top_k_top_p(logits, top_k=0, top_p=1.0, temperature=1.0):
    logits = logits / max(temperature, 1e-8)
    if top_k > 0:
        top_k_val = logits.topk(top_k).values[-1]
        logits[logits < top_k_val] = float('-inf')
    if top_p < 1.0:
        sorted_logits, sorted_idx = torch.sort(logits, descending=True)
        probs = torch.softmax(sorted_logits, dim=-1)
        cumsum = torch.cumsum(probs, dim=-1)
        mask = (cumsum - probs) > top_p
        sorted_logits[mask] = float('-inf')
        logits = torch.empty_like(logits).scatter_(0, sorted_idx, sorted_logits)
    probs = torch.softmax(logits, dim=-1)
    return torch.multinomial(probs, 1).item()",
}