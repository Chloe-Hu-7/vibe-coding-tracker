import { tasks } from './types';

export async function callDeepSeekAPI(apiKey: string, messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API调用失败: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function generateQuestionForDay(day: number): string {
  const task = tasks.find(t => t.day === day);
  if (!task) return '请介绍一下今天的学习内容';

  return `你是VibeCoding学习导师。请根据以下概念提出一个检验学习效果的问题（只需要一个问题）：

概念：${task.concept}
任务：${task.title}

请用简洁的语言提出这个问题，让学习者能够用自己理解的方式回答。`;
}

export function generateFeedbackPrompt(day: number, question: string, answer: string): string {
  const task = tasks.find(t => t.day === day);
  if (!task) return '';

  return `你是VibeCoding学习导师。请根据费曼学习法评价以下回答：

学习概念：${task.concept}
问题：${question}
学习者回答：${answer}

请按以下格式给出反馈：
1. 评价：回答得如何？
2. 改进建议：如果回答有不足，给出改进方向
3. 总结：一句话总结这个概念的核心要点

注意：用温和鼓励的语气，编程新手也能看懂。`;
}
