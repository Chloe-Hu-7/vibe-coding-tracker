'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStateContext } from '@/components/StateProvider';
import { tasks } from '@/lib/types';
import { saveNote, loadState } from '@/lib/storage';
import { FileText, Save, Clock } from 'lucide-react';

export default function NotesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, refresh } = useStateContext();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const dayParam = searchParams.get('day');
    if (dayParam) {
      setSelectedDay(parseInt(dayParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedDay) {
      const note = state.notes.find(n => n.day === selectedDay);
      setContent(note?.content || '');
      setSaved(false);
    }
  }, [selectedDay, state.notes]);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    router.push(`/notes?day=${day}`, { scroll: false });
  };

  const handleSave = () => {
    if (!selectedDay || !content.trim()) return;
    saveNote(selectedDay, content);
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedTask = tasks.find(t => t.day === selectedDay);
  const notesWithContent = state.notes.filter(n => n.content.trim());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">费曼学习笔记</h1>
        <p className="text-gray-500 mt-1">
          用笔记记录你的学习心得，输出巩固输入
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择学习天数
            </label>
            <div className="flex flex-wrap gap-2">
              {tasks.map((task) => {
                const hasNote = state.notes.some(n => n.day === task.day && n.content.trim());
                const isSelected = selectedDay === task.day;
                return (
                  <button
                    key={task.day}
                    onClick={() => handleSelectDay(task.day)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-white'
                        : hasNote
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Day {task.day}
                    {hasNote && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTask && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedTask.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedTask.concept}
                  </p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saved ? '已保存' : '保存笔记'}
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你的学习笔记...

可以用费曼学习法：
1. 用简单的话解释这个概念
2. 记录你学到了什么
3. 总结你的收获"
                className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Sidebar - Recent Notes */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">最近笔记</h3>
          {notesWithContent.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">还没有笔记</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notesWithContent
                .sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
                .slice(0, 5)
                .map((note) => {
                  const task = tasks.find(t => t.day === note.day);
                  return (
                    <button
                      key={note.day}
                      onClick={() => handleSelectDay(note.day)}
                      className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-emerald-600">
                          Day {note.day}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(note.timestamp).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {note.content}
                      </p>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
