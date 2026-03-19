'use client';

import Link from 'next/link';
import { useStateContext } from '@/components/StateProvider';
import { getProgressPercentage, getCompletedCount } from '@/lib/storage';
import { tasks } from '@/lib/types';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function Home() {
  const { state } = useStateContext();
  const progress = getProgressPercentage(state);
  const completed = getCompletedCount(state);

  // Find today's task (next uncompleted)
  const nextTask = tasks.find(t => {
    const taskProgress = state.tasks.find(st => st.day === t.day);
    return !taskProgress?.completed;
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          欢迎来到 VibeCoding 学习营
        </h1>
        <p className="text-emerald-100 text-lg">
          21天AI辅助编程学习之旅，每天进步一点点
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">整体进度</div>
          <div className="text-3xl font-bold text-emerald-600">{progress}%</div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">已完成天数</div>
          <div className="text-3xl font-bold text-emerald-600">
            {completed} <span className="text-lg font-normal text-gray-400">/ {tasks.length}</span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            继续加油！
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">剩余天数</div>
          <div className="text-3xl font-bold text-gray-700">
            {tasks.length - completed}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            坚持就是胜利
          </div>
        </div>
      </div>

      {/* Today's Task CTA */}
      {nextTask ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-emerald-600 mb-2">
                <Sparkles className="w-4 h-4 mr-1" />
                今日任务
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {nextTask.title}
              </h2>
              <p className="text-gray-500 mt-1">
                {nextTask.description}
              </p>
            </div>
            <Link
              href={`/tasks?day=${nextTask.day}`}
              className="flex items-center px-5 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              开始任务
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-emerald-700">
                恭喜完成所有任务！
              </h2>
              <p className="text-emerald-600">
                你已经完成了21天VibeCoding学习之旅
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/qa"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600">
                AI 费曼问答
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                用AI检验你的学习效果
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
          </div>
        </Link>

        <Link
          href="/notes"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600">
                费曼学习笔记
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                记录你的学习心得
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
          </div>
        </Link>
      </div>
    </div>
  );
}
