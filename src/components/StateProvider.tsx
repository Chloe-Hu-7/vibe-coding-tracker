'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from '@/lib/types';
import { loadState, saveState } from '@/lib/storage';

interface StateContextType {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  refresh: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...newState };
      saveState(updated);
      return updated;
    });
  };

  const refresh = () => {
    setState(loadState());
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <StateContext.Provider value={{ state, updateState, refresh }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within StateProvider');
  }
  return context;
}
