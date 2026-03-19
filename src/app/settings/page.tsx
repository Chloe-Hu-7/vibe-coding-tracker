'use client';

import { useState } from 'react';
import { useStateContext } from '@/components/StateProvider';
import { saveApiKey } from '@/lib/storage';
import { Key, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { state, refresh } = useStateContext();
  const [apiKey, setApiKey] = useState(state.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveApiKey(apiKey);
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">设置</h1>
        <p className="text-gray-500 mt-1">
          配置你的学习工具
        </p>
      </div>

      {/* API Key Setting */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <Key className="w-5 h-5 text-emerald-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">DeepSeek API Key</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          用于 AI 费曼问答功能。请在 DeepSeek 官网获取 API Key。
        </p>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存
              </>
            )}
          </button>
        </div>
        {apiKey && (
          <p className="mt-2 text-sm text-emerald-600">
            API Key 已配置 ✓
          </p>
        )}
      </div>

      {/* About */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">关于</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>VibeCoding 学习打卡助手</strong>
          </p>
          <p>
            21天 AI 辅助编程学习之旅，帮助编程小白掌握 VibeCoding。
          </p>
          <p className="pt-2">
            数据存储在浏览器本地存储中，不会上传到服务器。
          </p>
        </div>
      </div>
    </div>
  );
}
