'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStateContext } from '@/components/StateProvider';
import { tasks } from '@/lib/types';
import { saveQARecord, loadState } from '@/lib/storage';
import { callDeepSeekAPI, generateQuestionForDay, generateFeedbackPrompt } from '@/lib/api';
import { Sparkles, Send, Loader2, MessageCircle, AlertCircle } from 'lucide-react';

export default function QAPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, refresh } = useStateContext();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const apiKey = state.apiKey;

  useEffect(() => {
    const dayParam = searchParams.get('day');
    if (dayParam) {
      setSelectedDay(parseInt(dayParam));
    }
  }, [searchParams]);

  const selectedTask = tasks.find(t => t.day === selectedDay);

  // Get today's uncompleted task or first uncompleted
  const uncompletedTasks = tasks.filter(t => {
    const taskProgress = state.tasks.find(st => st.day === t.day);
    return !taskProgress?.completed;
  });
  const defaultDay = uncompletedTasks[0]?.day || tasks[0].day;

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setQuestion('');
    setAnswer('');
    setFeedback('');
    setError('');
    router.push(`/qa?day=${day}`, { scroll: false });
  };

  const handleGenerateQuestion = async () => {
    if (!apiKey) {
      router.push('/settings');
      return;
    }
    if (!selectedDay) return;

    setLoading(true);
    setError('');
    setQuestion('');
    setAnswer('');
    setFeedback('');

    try {
      const prompt = generateQuestionForDay(selectedDay);
      const result = await callDeepSeekAPI(apiKey, [
        { role: 'user', content: prompt }
      ]);
      setQuestion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成问题失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!apiKey || !question || !answer.trim()) return;

    setLoading(true);
    setError('');

    try {
      const prompt = generateFeedbackPrompt(selectedDay!, question, answer);
      const result = await callDeepSeekAPI(apiKey, [
        { role: 'user', content: prompt }
      ]);
      setFeedback(result);

      // Save the record
      const record = {
        day: selectedDay!,
        question,
        userAnswer: answer,
        aiFeedback: result,
        timestamp: new Date().toISOString(),
      };
      saveQARecord(record);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交回答失败');
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          需要配置 API Key
        </h2>
        <p className="text-gray-500 mb-4">
          请先在设置页面配置 DeepSeek API Key
        </p>
        <a
          href="/settings"
          className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          去设置
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">AI 费曼问答</h1>
        <p className="text-gray-500 mt-1">
          用AI检验你对概念的理解程度
        </p>
      </div>

      {/* Day Selection */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选择学习天数
        </label>
        <div className="flex flex-wrap gap-2">
          {tasks.map((task) => {
            const isSelected = selectedDay === task.day;
            const isCompleted = state.tasks.find(t => t.day === task.day)?.completed;
            return (
              <button
                key={task.day}
                onClick={() => handleSelectDay(task.day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 text-white'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Day {task.day}
                {isCompleted && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>

      {selectedTask && (
        <>
          {/* Current Concept */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center text-sm text-blue-600 mb-2">
              <Sparkles className="w-4 h-4 mr-1" />
              今日概念
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedTask.concept}
            </h3>
            <p className="text-gray-500 mt-1">
              {selectedTask.title}
            </p>
          </div>

          {/* Question Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            {!question ? (
              <div className="text-center py-6">
                <button
                  onClick={handleGenerateQuestion}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      生成问题中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      开始答题
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <MessageCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">问题</div>
                    <p className="text-gray-800">{question}</p>
                  </div>
                </div>

                {/* Answer Input */}
                {!feedback && (
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      写下你的理解
                    </label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="用你自己的话解释这个概念..."
                      className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={loading || !answer.trim()}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          AI评判中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          提交回答
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-start">
                      <Sparkles className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">AI 反馈</div>
                        <div className="text-gray-800 whitespace-pre-wrap">{feedback}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateQuestion}
                      className="mt-4 text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      再答一题 →
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* History */}
          {state.qaRecords.filter(r => r.day === selectedDay).length > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">历史记录</h3>
              <div className="space-y-4">
                {state.qaRecords
                  .filter(r => r.day === selectedDay)
                  .slice(-3)
                  .reverse()
                  .map((record, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">问题</div>
                      <p className="text-gray-800 text-sm mb-2">{record.question}</p>
                      <div className="text-sm text-gray-500 mb-1">你的回答</div>
                      <p className="text-gray-700 text-sm">{record.userAnswer}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
