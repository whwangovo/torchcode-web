"""Speculative Decoding task."""

TASK = {
    "title": "Speculative Decoding",
    "difficulty": "Hard",
    "function_name": "speculative_decode",
    "hint": "For each draft token i: accept with prob min(1, p_target[i,token]/p_draft[i,token]). If rejected, sample from max(0, p_target - p_draft) normalized. Return list of accepted tokens (may include one resampled).",
    "tests": [
        {
            "name": "Perfect draft: all accepted",
            "code": "\nimport torch\ntorch.manual_seed(0)\nprobs = torch.softmax(torch.randn(4, 10), dim=-1)\ntokens = torch.tensor([2, 5, 1, 8])\naccepted = {fn}(probs, probs, tokens)\nassert len(accepted) == 4, f'Perfect draft should accept all, got {len(accepted)}'\nfor i in range(4):\n    assert accepted[i] == tokens[i].item(), f'Token {i} mismatch'\n"
        },
        {
            "name": "Output length bounded",
            "code": "\nimport torch\ntorch.manual_seed(0)\nK = 5\ntarget = torch.softmax(torch.randn(K, 8), dim=-1)\ndraft = torch.softmax(torch.randn(K, 8), dim=-1)\ntokens = torch.randint(0, 8, (K,))\naccepted = {fn}(target, draft, tokens)\nassert 1 <= len(accepted) <= K, f'Length {len(accepted)} not in [1, {K}]'\n"
        },
        {
            "name": "All tokens valid",
            "code": "\nimport torch\nV = 8\nfor seed in range(20):\n    torch.manual_seed(seed)\n    target = torch.softmax(torch.randn(3, V), dim=-1)\n    draft = torch.softmax(torch.randn(3, V), dim=-1)\n    tokens = torch.randint(0, V, (3,))\n    for t in {fn}(target, draft, tokens):\n        assert 0 <= t < V, f'Token {t} out of range'\n"
        }
    ],
    "solution": '''def speculative_decode(target_probs, draft_probs, draft_tokens):
    K = len(draft_tokens)
    accepted = []
    for i in range(K):
        t = draft_tokens[i].item()
        ratio = target_probs[i, t] / max(draft_probs[i, t].item(), 1e-10)
        if torch.rand(1).item() < min(1.0, ratio.item()):
            accepted.append(t)
        else:
            adjusted = torch.clamp(target_probs[i] - draft_probs[i], min=0)
            s = adjusted.sum()
            if s > 0:
                adjusted = adjusted / s
            else:
                adjusted = torch.ones_like(adjusted) / adjusted.shape[0]
            accepted.append(torch.multinomial(adjusted, 1).item())
            return accepted
    return accepted''',
}