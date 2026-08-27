'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  getTodos,
  updateTodo as updateTodoRequest,
} from '@/services/todoApi';
import type { ApiTodo, Feedback, Todo, TodoChanges } from '@/types/todo';

function toTodo(todo: ApiTodo): Todo {
  return { ...todo, clientId: `api-${todo.id}` };
}

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function newClientId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `local-${crypto.randomUUID()}`;
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [busyItems, setBusyItems] = useState<Set<string>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const activeLoad = useRef<AbortController | null>(null);
  const feedbackId = useRef(0);

  const showFeedback = useCallback((tone: Feedback['tone'], message: string) => {
    feedbackId.current += 1;
    setFeedback({ id: feedbackId.current, tone, message });
  }, []);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    activeLoad.current?.abort();
    const controller = new AbortController();
    activeLoad.current = controller;

    if (mode === 'initial') setInitialLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    setLoadError(null);

    try {
      const data = await getTodos(controller.signal);
      setTodos(data.map(toTodo));
      if (mode === 'refresh') {
        showFeedback('success', 'Todo list refreshed from JSONPlaceholder.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      const message = messageFrom(error);
      setLoadError(message);
      if (mode === 'refresh') showFeedback('error', message);
    } finally {
      if (!controller.signal.aborted) {
        setInitialLoading(false);
        setRefreshing(false);
      }
    }
  }, [showFeedback]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load('initial'), 0);
    return () => {
      window.clearTimeout(timer);
      activeLoad.current?.abort();
    };
  }, [load]);

  const markBusy = useCallback((clientId: string, busy: boolean) => {
    setBusyItems((current) => {
      const next = new Set(current);
      if (busy) next.add(clientId);
      else next.delete(clientId);
      return next;
    });
  }, []);

  const createTodo = useCallback(async (title: string, completed: boolean) => {
    setCreating(true);
    try {
      const created = await createTodoRequest({ title, completed, userId: 1 });
      const localTodo: Todo = {
        userId: created.userId ?? 1,
        id: created.id,
        title: created.title ?? title,
        completed: created.completed ?? completed,
        clientId: newClientId(),
        isLocal: true,
      };
      setTodos((current) => [localTodo, ...current]);
      showFeedback('success', 'Todo created and added to this session.');
      return true;
    } catch (error) {
      showFeedback('error', messageFrom(error));
      return false;
    } finally {
      setCreating(false);
    }
  }, [showFeedback]);

  const updateTodo = useCallback(async (todo: Todo, changes: Partial<TodoChanges>) => {
    markBusy(todo.clientId, true);
    setTodos((current) => current.map((item) => (
      item.clientId === todo.clientId ? { ...item, ...changes } : item
    )));

    try {
      const updated = await updateTodoRequest(todo.id, changes);
      setTodos((current) => current.map((item) => (
        item.clientId === todo.clientId
          ? { ...item, ...changes, ...updated, clientId: item.clientId, isLocal: item.isLocal }
          : item
      )));
      showFeedback('success', changes.title ? 'Todo updated.' : 'Todo status updated.');
      return true;
    } catch (error) {
      setTodos((current) => current.map((item) => (
        item.clientId === todo.clientId ? todo : item
      )));
      showFeedback('error', `${messageFrom(error)} Your change was reverted.`);
      return false;
    } finally {
      markBusy(todo.clientId, false);
    }
  }, [markBusy, showFeedback]);

  const deleteTodo = useCallback(async (todo: Todo) => {
    let originalIndex = 0;
    setTodos((current) => {
      originalIndex = current.findIndex((item) => item.clientId === todo.clientId);
      return current.filter((item) => item.clientId !== todo.clientId);
    });
    markBusy(todo.clientId, true);

    try {
      await deleteTodoRequest(todo.id);
      showFeedback('success', 'Todo deleted from this session.');
      return true;
    } catch (error) {
      setTodos((current) => {
        if (current.some((item) => item.clientId === todo.clientId)) return current;
        const next = [...current];
        next.splice(Math.max(0, originalIndex), 0, todo);
        return next;
      });
      showFeedback('error', `${messageFrom(error)} The todo was restored.`);
      return false;
    } finally {
      markBusy(todo.clientId, false);
    }
  }, [markBusy, showFeedback]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return { total: todos.length, completed, pending: todos.length - completed };
  }, [todos]);

  const isMutating = creating || busyItems.size > 0;
  const dismissFeedback = useCallback(() => setFeedback(null), []);

  return {
    todos,
    stats,
    initialLoading,
    refreshing,
    creating,
    busyItems,
    loadError,
    feedback,
    isMutating,
    createTodo,
    updateTodo,
    deleteTodo,
    refresh: () => load('refresh'),
    retry: () => load('initial'),
    dismissFeedback,
  };
}
