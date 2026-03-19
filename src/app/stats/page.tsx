'use client';

import { useStateContext } from '@/components/StateProvider';
import { getProgressPercentage, getCompletedCount } from '@/lib/storage';
import { tasks } from '@/lib/types';
import { CheckCircle, Flame, Calendar, Target } from 'lucide-react';

export default function StatsPage() {
  const { state } = useStateContext();
  const progress = getProgressPercentage(state);
  const completed = getCompletedCount(state);

  // Calculate streak
  const completedDays = state.tasks
    .filter(t => t.completed)
    .map(t => t.day)
    .sort((a, b) => a - b);

  // Generate calendar data (last 4 weeks)
  const today = new Date();
  const calendarDays: { date: Date; day: number | null }[] = [];

  // Start from 4 weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 27);

  for (let i = 0; i < 28; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const day = date.getDate();
    calendarDays.push({ date, day });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">学习统计</h1>
        <p className="text-gray-500 mt-1">
          记录你的学习轨迹
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center text-gray-500 mb-2">
            <Target className="w-4 h-4 mr-1.5" />
            完成进度
          </div>
          <div className="text-3xl font-bold text-emerald-600">{progress}%</div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center text-gray-500 mb-2">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            已完成天数
          </div>
          <div className="text-3xl font-bold text-emerald-600">
            {completed} <span className="text-lg font-normal text-gray-400">/ {tasks.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-1.5" />
            剩余天数
          </div>
          <div className="text-3xl font-bold text-gray-700">
            {tasks.length - completed}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center text-gray-500 mb-2">
            <Flame className="w-4 h-4 mr-1.5" />
            笔记数量
          </div>
          <div className="text-3xl font-bold text-gray-700">
            {state.notes.filter(n => n.content.trim()).length}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">学习日历</h2>
        <div className="grid grid-cols-7 gap-1">
          {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
            <div key={day} className="text-center text-xs text-gray-400 py-1">
              {day}
            </div>
          ))}
          {calendarDays.map(({ date, day }, idx) => {
            const isCompleted = completedDays.includes(day || 0);
            const isToday = date.toDateString() === today.toDateString();
            const isFuture = date > today;

            return (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center text-xs rounded ${
                  isFuture
                    ? 'text-gray-200'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end mt-4 text-xs text-gray-500 space-x-4">
          <span className="flex items-center">
            <span className="w-3 h-3 bg-emerald-500 rounded mr-1"></span>
            已完成
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 bg-gray-100 rounded mr-1"></span>
            未完成
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">已完成任务</h2>
        {completedDays.length === 0 ? (
          <p className="text-gray-500 text-sm">还没有完成任务</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {completedDays.map(day => {
              const task = tasks.find(t => t.day === day);
              return (
                <span
                  key={day}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm"
                >
                  Day {day}: {task?.title.replace('Day ' + day + ': ', '')}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
