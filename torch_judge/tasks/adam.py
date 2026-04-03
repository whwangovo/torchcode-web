"""Adam Optimizer task."""

TASK = {
    "title": "Adam Optimizer",
    "difficulty": "Medium",
    "function_name": "MyAdam",
    "hint": "Track m (1st moment) and v (2nd moment). m = beta1*m + (1-beta1)*grad, v = beta2*v + (1-beta2)*grad^2. Bias correct: m_hat = m/(1-beta1^t). Update: p -= lr * m_hat / (sqrt(v_hat) + eps).",
    "tests": [
        {
            "name": "Parameters change after step",
            "code": "\nimport torch\ntorch.manual_seed(0)\nw = torch.randn(4, 3, requires_grad=True)\nopt = {fn}([w], lr=0.01)\n(w ** 2).sum().backward()\nw_before = w.data.clone()\nopt.step()\nassert not torch.equal(w.data, w_before), 'Should change after step'\n"
        },
        {
            "name": "Matches torch.optim.Adam",
            "code": "\nimport torch\ntorch.manual_seed(0)\nw1 = torch.randn(8, 4, requires_grad=True)\nw2 = w1.data.clone().requires_grad_(True)\nopt1 = {fn}([w1], lr=0.001, betas=(0.9, 0.999), eps=1e-8)\nopt2 = torch.optim.Adam([w2], lr=0.001, betas=(0.9, 0.999), eps=1e-8)\nfor _ in range(5):\n    (w1 ** 2).sum().backward()\n    opt1.step(); opt1.zero_grad()\n    (w2 ** 2).sum().backward()\n    opt2.step(); opt2.zero_grad()\nassert torch.allclose(w1.data, w2.data, atol=1e-5), f'Max diff: {(w1.data-w2.data).abs().max():.6f}'\n"
        },
        {
            "name": "zero_grad works",
            "code": "\nimport torch\nw = torch.randn(4, requires_grad=True)\nopt = {fn}([w], lr=0.01)\n(w ** 2).sum().backward()\nassert w.grad.abs().sum() > 0\nopt.zero_grad()\nassert w.grad.abs().sum() == 0, 'zero_grad should zero all gradients'\n"
        }
    ],
    "solution": '''class MyAdam:
    def __init__(self, params, lr=1e-3, betas=(0.9, 0.999), eps=1e-8):
        self.params = list(params)
        self.lr = lr
        self.beta1, self.beta2 = betas
        self.eps = eps
        self.t = 0
        self.m = [torch.zeros_like(p) for p in self.params]
        self.v = [torch.zeros_like(p) for p in self.params]

    def step(self):
        self.t += 1
        with torch.no_grad():
            for i, p in enumerate(self.params):
                if p.grad is None:
                    continue
                self.m[i] = self.beta1 * self.m[i] + (1 - self.beta1) * p.grad
                self.v[i] = self.beta2 * self.v[i] + (1 - self.beta2) * p.grad ** 2
                m_hat = self.m[i] / (1 - self.beta1 ** self.t)
                v_hat = self.v[i] / (1 - self.beta2 ** self.t)
                p -= self.lr * m_hat / (torch.sqrt(v_hat) + self.eps)

    def zero_grad(self):
        for p in self.params:
            if p.grad is not None:
                p.grad.zero_()''',
}