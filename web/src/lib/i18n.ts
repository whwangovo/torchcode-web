export type Locale = 'en' | 'zh';

const en = {
  // nav
  home: 'Home',
  problems: 'Problems',
  solvedCount: '{solved}/{total} solved',
  // home page
  heroPill: '{count} PyTorch challenges',
  heroTitle: 'Write it. Run it. Understand it.',
  heroSubtitle: 'Implement core operations from scratch — softmax, attention, GPT blocks and more. Instant feedback, real tests.',
  startPracticing: 'Start Practicing',
  // difficulty
  Easy: 'Easy',
  Medium: 'Medium',
  Hard: 'Hard',
  // status filters
  All: 'All',
  Todo: 'Todo',
  Attempted: 'Attempted',
  Solved: 'Solved',
  // problem list
  searchPlaceholder: 'Search problems...',
  noMatch: 'No problems match your filters.',
  // workspace
  description: 'Description',
  solution: 'Solution',
  loading: 'Loading...',
  networkError: 'Network error',
  implementFn: 'Implement the {fn} function.',
  testCases: 'Test Cases',
  moreTests: '+ {n} more tests',
  hint: 'Hint',
  submit: 'Submit',
  judging: 'Judging...',
  run: 'Run',
  running: 'Running...',
  allPassed: 'All Passed',
  passedCount: '{passed}/{total} Passed',
  // solutions
  loadingSolution: 'Loading solution...',
  noSolution: 'No solution available yet.',
  backToProblem: 'Back to problem',
  // home features
  feat1Title: 'Instant Feedback',
  feat1Desc: 'Pass/fail per test case, execution time, and error messages — right after you submit.',
  feat2Title: 'Real Tests',
  feat2Desc: 'Tests run against actual PyTorch — no mocks, no shortcuts. If it passes here, it works.',
  feat3Title: 'Progress Tracking',
  feat3Desc: 'Track solved problems, best times, and attempt counts across sessions.',
} as const;

const zh: typeof en = {
  home: '首页',
  problems: '题目',
  solvedCount: '{solved}/{total} 已解决',
  heroPill: '{count} 道 PyTorch 题目',
  heroTitle: '写出来。跑起来。真正懂了。',
  heroSubtitle: '从零实现核心算子——softmax、attention、GPT block 等。即时反馈，真实测试。',
  startPracticing: '开始练习',
  Easy: '简单',
  Medium: '中等',
  Hard: '困难',
  All: '全部',
  Todo: '未开始',
  Attempted: '尝试过',
  Solved: '已解决',
  searchPlaceholder: '搜索题目...',
  noMatch: '没有符合条件的题目。',
  description: '题目描述',
  solution: '题解',
  loading: '加载中...',
  networkError: '网络错误',
  implementFn: '实现 {fn} 函数。',
  testCases: '测试用例',
  moreTests: '+ {n} 个测试',
  hint: '提示',
  submit: '提交',
  judging: '评测中...',
  run: '运行',
  running: '运行中...',
  allPassed: '全部通过',
  passedCount: '{passed}/{total} 通过',
  loadingSolution: '加载题解中...',
  noSolution: '暂无题解。',
  backToProblem: '返回题目',
  feat1Title: '即时反馈',
  feat1Desc: '每个测试用例单独显示通过/失败、执行时间和错误信息，提交后立即可见。',
  feat2Title: '真实测试',
  feat2Desc: '测试直接跑在真实 PyTorch 上，没有 mock，没有捷径。这里过了，就是真的过了。',
  feat3Title: '进度追踪',
  feat3Desc: '跨会话记录已解决题目、最佳用时和尝试次数。',
};

export const dictionaries = { en, zh };

export type TranslationKey = keyof typeof en;

export function translate(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  let str: string = dictionaries[locale][key];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}

// Problem title translations (keyed by problem ID)
export const problemTitles: Record<string, { en: string; zh: string }> = {
  cross_entropy:       { en: 'Cross-Entropy Loss',                              zh: '交叉熵损失' },
  dropout:             { en: 'Implement Dropout',                               zh: '实现 Dropout' },
  embedding:           { en: 'Embedding Layer',                                 zh: 'Embedding 层' },
  gelu:                { en: 'GELU Activation',                                 zh: 'GELU 激活函数' },
  gradient_accumulation: { en: 'Gradient Accumulation',                         zh: '梯度累积' },
  gradient_clipping:   { en: 'Gradient Norm Clipping',                          zh: '梯度范数裁剪' },
  relu:                { en: 'Implement ReLU',                                  zh: '实现 ReLU' },
  softmax:             { en: 'Implement Softmax',                               zh: '实现 Softmax' },
  weight_init:         { en: 'Kaiming Initialization',                          zh: 'Kaiming 初始化' },
  adam:                { en: 'Adam Optimizer',                                   zh: 'Adam 优化器' },
  batchnorm:           { en: 'Implement BatchNorm',                             zh: '实现 BatchNorm' },
  beam_search:         { en: 'Beam Search Decoding',                            zh: '束搜索解码' },
  conv2d:              { en: '2D Convolution',                                  zh: '二维卷积' },
  cosine_lr:           { en: 'Cosine LR Scheduler with Warmup',                 zh: '余弦学习率调度（含预热）' },
  cross_attention:     { en: 'Multi-Head Cross-Attention',                      zh: '多头交叉注意力' },
  layernorm:           { en: 'Implement LayerNorm',                             zh: '实现 LayerNorm' },
  linear:              { en: 'Simple Linear Layer',                             zh: '简单线性层' },
  linear_regression:   { en: 'Linear Regression',                               zh: '线性回归' },
  lora:                { en: 'LoRA (Low-Rank Adaptation)',                       zh: 'LoRA（低秩适配）' },
  mlp:                 { en: 'SwiGLU MLP',                                      zh: 'SwiGLU MLP' },
  rmsnorm:             { en: 'Implement RMSNorm',                               zh: '实现 RMSNorm' },
  topk_sampling:       { en: 'Top-k / Top-p Sampling',                          zh: 'Top-k / Top-p 采样' },
  vit_patch:           { en: 'ViT Patch Embedding',                             zh: 'ViT Patch Embedding' },
  attention:           { en: 'Softmax Attention',                               zh: 'Softmax 注意力' },
  bpe:                 { en: 'Byte-Pair Encoding (BPE)',                         zh: '字节对编码（BPE）' },
  causal_attention:    { en: 'Causal Self-Attention',                           zh: '因果自注意力' },
  dpo_loss:            { en: 'DPO (Direct Preference Optimization) Loss',       zh: 'DPO 损失' },
  flash_attention:     { en: 'Flash Attention (Tiled)',                         zh: 'Flash Attention（分块）' },
  gpt2_block:          { en: 'GPT-2 Transformer Block',                         zh: 'GPT-2 Transformer Block' },
  gqa:                 { en: 'Grouped Query Attention',                         zh: '分组查询注意力（GQA）' },
  grpo_loss:           { en: 'GRPO (Group Relative Policy Optimization) Loss',  zh: 'GRPO 损失' },
  int8_quantization:   { en: 'INT8 Quantized Linear',                           zh: 'INT8 量化线性层' },
  kv_cache:            { en: 'KV Cache Attention',                              zh: 'KV Cache 注意力' },
  linear_attention:    { en: 'Linear Self-Attention',                           zh: '线性自注意力' },
  mha:                 { en: 'Multi-Head Attention',                            zh: '多头注意力' },
  moe:                 { en: 'Mixture of Experts (MoE)',                        zh: '混合专家模型（MoE）' },
  ppo_loss:            { en: 'PPO (Proximal Policy Optimization) Clipped Loss', zh: 'PPO 截断损失' },
  rope:                { en: 'Rotary Position Embedding (RoPE)',                zh: '旋转位置编码（RoPE）' },
  sliding_window:      { en: 'Sliding Window Attention',                        zh: '滑动窗口注意力' },
  speculative_decoding: { en: 'Speculative Decoding',                           zh: '推测解码' },
};

export function getProblemTitle(id: string, locale: Locale): string {
  return problemTitles[id]?.[locale] ?? problemTitles[id]?.en ?? id;
}
