/**
 * 简体中文文案（Requirements 14.1, 14.2）
 * 集中管理用户可见文本，便于后续多语言扩展
 */
export const zhCN = {
  // 通用
  common: {
    loading: '加载中...',
    retry: '重试',
    back: '返回',
    confirm: '确定',
    cancel: '取消',
  },

  // 导航与布局
  nav: {
    home: '脑力训练平台',
    backToHome: '返回主页',
    selectGame: '选择游戏',
    selectGameDescription: '选择下方任意游戏开始训练，提升注意力与认知控制能力。',
  },

  // 游戏通用
  game: {
    playAgain: '再玩一次',
    backToConfig: '返回配置',
    totalScore: '总分',
    personalBest: '个人最佳',
    history: '历史记录',
    totalPlays: '共玩 {count} 次',
    recentRecords: '最近记录',
  },

  // Stroop
  stroop: {
    name: 'Stroop 测试',
    description: '测试你的认知控制能力，识别文字颜色而非文字内容',
    reportTitle: '测试报告',
    accuracy: '准确率',
    avgResponseTime: '平均反应时间',
    stroopEffect: 'Stroop 效应',
    keyboardHint: '键盘快捷键：R 红色 · G 绿色 · B 蓝色 · Y 黄色 · P 紫色',
  },

  // Schulte
  schulte: {
    name: '舒尔特方格',
    description: '提升注意力和视觉搜索速度，按顺序点击数字',
    reportTitle: '游戏报告',
    inputHint: '使用鼠标按顺序点击数字 1 到 {total}',
  },

  // 错误与状态
  error: {
    generic: '抱歉，应用遇到了一个错误。您可以尝试重新加载页面或返回上一步。',
    reload: '重新加载页面',
    tryRecover: '尝试恢复',
  },
} as const;

export type ZhCNKeys = typeof zhCN;
