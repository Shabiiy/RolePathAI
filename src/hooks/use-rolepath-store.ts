
'use client'

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import type { AppState, RoadmapData } from '@/types'

const LOCAL_STORAGE_KEY = 'rolepath-ai-state-v2';

let store: AppState = {
  roadmaps: [],
  currentRoadmapIndex: -1,
};

const listeners = new Set<() => void>();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const RolepathStore = {
  getSnapshot: () => {
    return store;
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  updateStore: (updater: (prevState: AppState) => AppState) => {
    store = updater(store);
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
    emitChange();
  },

  hydrate: () => {
    try {
      const savedState = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Basic validation
        if (Array.isArray(parsedState.roadmaps) && typeof parsedState.currentRoadmapIndex === 'number') {
          store = parsedState;
        } else {
           // Handle migration from old state format
           const oldState = parsedState as any;
            if (oldState.roadmap) {
                const migratedRoadmap: RoadmapData = {
                    id: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    inputs: oldState.inputs,
                    roadmap: oldState.roadmap,
                    projects: oldState.projects,
                    resources: oldState.resources,
                    tasks: oldState.tasks,
                    analysis: oldState.analysis
                }
                store = { roadmaps: [migratedRoadmap], currentRoadmapIndex: 0 };
            }
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
    emitChange();
  },
};

export function useRolePathStore(): [
  AppState,
  {
    addNewRoadmap: (roadmapData: Omit<RoadmapData, 'id' | 'createdAt'>) => number;
    updateTaskCompletion: (taskId: string, completed: boolean) => void;
    importState: (newState: AppState) => void;
    setCurrentRoadmap: (index: number) => void;
  },
  boolean
] {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    RolepathStore.hydrate();
    setIsHydrated(true);
  }, []);

  const state = useSyncExternalStore(RolepathStore.subscribe, RolepathStore.getSnapshot, RolepathStore.getSnapshot);

  const addNewRoadmap = useCallback((newRoadmapData: Omit<RoadmapData, 'id' | 'createdAt'>): number => {
    let newIndex = -1;
    RolepathStore.updateStore(prevState => {
      const newRoadmap: RoadmapData = {
        ...newRoadmapData,
        id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const updatedRoadmaps = [...prevState.roadmaps, newRoadmap];
      newIndex = updatedRoadmaps.length - 1;
      return {
        roadmaps: updatedRoadmaps,
        currentRoadmapIndex: newIndex,
      };
    });
    return newIndex;
  }, []);

  const updateTaskCompletion = useCallback((taskId: string, completed: boolean) => {
    RolepathStore.updateStore(prevState => {
      if (prevState.currentRoadmapIndex === -1) return prevState;

      const currentRoadmap = prevState.roadmaps[prevState.currentRoadmapIndex];
      if (!currentRoadmap || !currentRoadmap.tasks) return prevState;

      const newTasks = currentRoadmap.tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      );
      
      const updatedRoadmaps = [...prevState.roadmaps];
      updatedRoadmaps[prevState.currentRoadmapIndex] = { ...currentRoadmap, tasks: newTasks };

      return { ...prevState, roadmaps: updatedRoadmaps };
    });
  }, []);

  const importState = useCallback((newState: AppState) => {
    if (newState.roadmaps && typeof newState.currentRoadmapIndex === 'number') {
      RolepathStore.updateStore(() => newState);
    } else {
      console.error("Invalid state shape for import.");
    }
  }, []);

  const setCurrentRoadmap = useCallback((index: number) => {
    RolepathStore.updateStore(prevState => ({ ...prevState, currentRoadmapIndex: index }));
  }, []);
  
  const storeActions = {
    addNewRoadmap,
    updateTaskCompletion,
    importState,
    setCurrentRoadmap,
  };

  return [state, storeActions, isHydrated];
}
