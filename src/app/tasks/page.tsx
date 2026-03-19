'use client';

import { useStateContext } from '@/components/StateProvider';
import { updateTaskProgress } from '@/lib/storage';
import { tasks } from '@/lib/types';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function TasksPage() {
  const { state, refresh } = useStateContext();

  const handleToggle = (day: number) => {
    const taskProgress = state.tasks.find(t => t.day === day);
    const newCompleted = !taskProgress?.completed;
    updateTaskProgress(day, newCompleted);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">每日任务</h1>
        <p className="text-gray-500 mt-1">
          完成每日任务，见证自己的成长
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const taskProgress = state.tasks.find(t => t.day === task.day);
          const isCompleted = taskProgress?.completed;
          const completedAt = taskProgress?.completedAt;

          return (
            <div
              key={task.day}
              className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleToggle(task.day)}
                    className="mt-0.5 focus:outline-none"
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-emerald-400" />
                    )}
                  </button>
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      isCompleted ? 'text-emerald-700' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {task.description}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>Day {task.day}</span>
                      {isCompleted && completedAt && (
                        <span className="ml-2 text-emerald-500">
                          • 已完成
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
