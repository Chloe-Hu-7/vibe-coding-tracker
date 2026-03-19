// Task data for Day 4-21 (18 days)
export interface Task {
  day: number;
  title: string;
  description: string;
  concept: string;
}

export const tasks: Task[] = [
  { day: 4, title: "Day 4: 修改代码，看变化", description: "尝试修改代码参数，观察效果变化", concept: "学会阅读和理解代码" },
  { day: 5, title: "Day 5: 复制粘贴成功案例", description: "找官方示例，复制运行成功", concept: "官方文档的使用方法" },
  { day: 6, title: "Day 6: 小改官方示例", description: "在成功案例上做小修改", concept: "如何在官方示例基础上定制" },
  { day: 7, title: "Day 7: 解决报错", description: "尝试自己搜索解决简单报错", concept: "错误信息的阅读与问题定位" },
  { day: 8, title: "Day 8: 写第一个简单功能", description: "不借助AI，独立完成简单功能", concept: "独立编程的思考流程" },
  { day: 9, title: "Day 9: 用AI辅助查文档", description: "向AI询问官方文档中的具体内容", concept: "AI作为文档助手的用法" },
  { day: 10, title: "Day 10: 让AI解释代码", description: "把复杂代码发给AI，要求逐行解释", concept: "代码阅读技巧" },
  { day: 11, title: "Day 11: 让AI重构代码", description: "让AI把代码写得更易读", concept: "代码可读性的重要性" },
  { day: 12, title: "Day 12: 调试复杂报错", description: "尝试分析和解决较难的错误", concept: "调试技巧与思维" },
  { day: 13, title: "Day 13: 让AI生成测试用例", description: "学会让AI帮助编写测试", concept: "测试驱动的概念" },
  { day: 14, title: "Day 14: 完成一个完整功能", description: "独立完成包含UI和逻辑的完整功能", concept: "功能开发完整流程" },
  { day: 15, title: "Day 15: 代码审查", description: "让AI审查自己写的代码", concept: "代码审查的意义" },
  { day: 16, title: "Day 16: 性能优化", description: "让AI帮助分析和优化性能", concept: "性能优化的基本概念" },
  { day: 17, title: "Day 17: 查阅英文文档", description: "尝试阅读英文官方文档", concept: "英文文档阅读技巧" },
  { day: 18, title: "Day 18: 参与开源项目", description: "提交一个简单的PR或Issue", concept: "开源协作流程" },
  { day: 19, title: "Day 19: 技术博客写作", description: "写一篇学习笔记或技术博客", concept: "费曼学习法 - 输出巩固输入" },
  { day: 20, title: "Day 20: 架构设计讨论", description: "和AI讨论一个系统的架构设计", concept: "系统设计基础" },
  { day: 21, title: "Day 21: 总结与展望", description: "回顾21天学习，展望未来方向", concept: "持续学习的方法" },
];

export interface TaskProgress {
  day: number;
  completed: boolean;
  completedAt?: string;
}

export interface QARecord {
  day: number;
  question: string;
  userAnswer: string;
  aiFeedback: string;
  timestamp: string;
}

export interface Note {
  day: number;
  content: string;
  timestamp: string;
}

export interface AppState {
  tasks: TaskProgress[];
  notes: Note[];
  qaRecords: QARecord[];
  apiKey: string;
  streakDays: number;
  lastActiveDate: string;
}
