"""PPO (Proximal Policy Optimization) clipped loss task."""

TASK = {
    "title": "PPO (Proximal Policy Optimization) Clipped Loss",
    "difficulty": "Hard",
    "function_name": "ppo_loss",
    "hint": (
        "Compute ratio r = exp(new_logps - old_logps_detached). "
        "Form unclipped = r * adv_detached and clipped = clamp(r, 1-clip, 1+clip) * adv_detached. "
        "Return the negative mean of min(unclipped, clipped). "
        "Gradients should flow only through new_logps."
    ),
    "tests": [
        {
            "name": "Basic shape & type",
            "code": "\n"
            "import torch\n"
            "from torch import Tensor\n"
            "new_logps = torch.randn(16, requires_grad=True)\n"
            "old_logps = torch.randn(16)\n"
            "advantages = torch.randn(16)\n"
            "loss = {fn}(new_logps, old_logps, advantages)\n"
            "assert isinstance(loss, Tensor) and loss.dim() == 0, 'Loss must be scalar Tensor'\n"
        },
        {
            "name": "Numeric check vs fixed value",
            "code": "\n"
            "import torch\n"
            "new_logps = torch.tensor([0.0, -0.2, -0.4, -0.6])\n"
            "old_logps = torch.tensor([0.0, -0.1, -0.5, -0.5])\n"
            "advantages = torch.tensor([1.0, -1.0, 0.5, -0.5])\n"
            "loss = {fn}(new_logps, old_logps, advantages, clip_ratio=0.2)\n"
            "expected = torch.tensor(-0.0488)\n"
            "assert torch.allclose(loss, expected, atol=1e-4, rtol=0), 'Loss should match the expected numeric value on the fixed example'\n"
        },
        {
            "name": "Gradient flows to new_logps only",
            "code": "\n"
            "import torch\n"
            "new_logps = torch.randn(8, requires_grad=True)\n"
            "old_logps = torch.randn(8, requires_grad=True)\n"
            "advantages = torch.randn(8, requires_grad=True)\n"
            "loss = {fn}(new_logps, old_logps, advantages)\n"
            "loss.backward()\n"
            "assert new_logps.grad is not None, 'Gradients should flow through new_logps'\n"
            "assert old_logps.grad is None, 'Gradients should not flow through old_logps (treat as constant baseline)'\n"
            "assert advantages.grad is None, 'Gradients should not flow through advantages (treat as constant advantages)'\n"
        },
    ],
    "solution": "def ppo_loss(new_logps: Tensor, old_logps: Tensor, advantages: Tensor,
             clip_ratio: float = 0.2) -> Tensor:
    \"\"\"PPO clipped surrogate loss.

    new_logps: (B,) current policy log-probs
    old_logps: (B,) old policy log-probs (treated as constant)
    advantages: (B,) advantage estimates (treated as constant)
    returns: scalar loss (Tensor)
    \"\"\"
    # Detach old_logps and advantages so gradients only flow through new_logps
    old_logps_detached = old_logps.detach()
    adv_detached = advantages.detach()

    # Importance sampling ratio r = pi_new / pi_old in log-space
    ratios = torch.exp(new_logps - old_logps_detached)

    # Unclipped and clipped objectives
    unclipped = ratios * adv_detached
    clipped = torch.clamp(ratios, 1.0 - clip_ratio, 1.0 + clip_ratio) * adv_detached

    # PPO objective: negative mean of the more conservative objective
    return -torch.min(unclipped, clipped).mean()",
}