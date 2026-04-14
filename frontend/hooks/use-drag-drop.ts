import { useState, useCallback, DragEvent } from 'react';
import type { Task, TaskStatus } from '@/lib/types';

export interface DragDropState {
  draggedTask: Task | null;
  dragOverColumn: TaskStatus | null;
  dragOverTaskId: string | null;
}

export interface UseDragDropReturn {
  state: DragDropState;
  handleDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>, column: TaskStatus, taskId?: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, targetColumn: TaskStatus, targetTaskId?: string) => void;
}

interface UseDragDropOptions {
  onTaskMove: (taskId: string, newStatus: TaskStatus, targetTaskId?: string) => void;
  onReorder: (taskId: string, targetTaskId: string, status: TaskStatus) => void;
}

export function useDragDrop({ onTaskMove, onReorder }: UseDragDropOptions): UseDragDropReturn {
  const [state, setState] = useState<DragDropState>({
    draggedTask: null,
    dragOverColumn: null,
    dragOverTaskId: null,
  });

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    // Add visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.5';
    }
    
    setState((prev) => ({ ...prev, draggedTask: task }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState({
      draggedTask: null,
      dragOverColumn: null,
      dragOverTaskId: null,
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>, column: TaskStatus, taskId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setState((prev) => ({
      ...prev,
      dragOverColumn: column,
      dragOverTaskId: taskId || null,
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dragOverColumn: null,
      dragOverTaskId: null,
    }));
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>, targetColumn: TaskStatus, targetTaskId?: string) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (!taskId || !state.draggedTask) return;
    
    // If dropping on a different column, change status
    if (state.draggedTask.status !== targetColumn) {
      onTaskMove(taskId, targetColumn, targetTaskId);
    } else if (targetTaskId && targetTaskId !== taskId) {
      // Same column, reorder
      onReorder(taskId, targetTaskId, targetColumn);
    }
    
    setState({
      draggedTask: null,
      dragOverColumn: null,
      dragOverTaskId: null,
    });
  }, [state.draggedTask, onTaskMove, onReorder]);

  return {
    state,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
