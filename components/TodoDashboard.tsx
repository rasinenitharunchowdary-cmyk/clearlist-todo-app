'use client';

import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { FeedbackToast } from '@/components/FeedbackToast';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { TodoStats } from '@/components/TodoStats';
import { TodoToolbar } from '@/components/TodoToolbar';
import { useTodos } from '@/hooks/useTodos';
import type { TodoFilter } from '@/types/todo';

const PAGE_SIZE = 12;

export function TodoDashboard() {
  const {
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
    refresh,
    retry,
    dismissFeedback,
  } = useTodos();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredTodos = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return todos.filter((todo) => {
      const matchesQuery = !normalizedQuery || todo.title.toLocaleLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'all'
        || (filter === 'completed' && todo.completed)
        || (filter === 'pending' && !todo.completed);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, todos]);

  const visibleTodos = filteredTodos.slice(0, visibleCount);
  const hasActiveFilters = query.trim().length > 0 || filter !== 'all';
  const clearFilters = () => {
    setQuery('');
    setFilter('all');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#182230]">
      <a href="#main-content" className="fixed left-4 top-3 z-50 -translate-y-20 rounded-lg bg-[#182230] px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">
        Skip to content
      </a>
      <AppHeader refreshing={refreshing} refreshDisabled={isMutating || initialLoading} onRefresh={refresh} />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
        <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#4f46e5]">My workspace</p>
            <h1 className="text-3xl font-black tracking-[-0.05em] text-[#182230] sm:text-4xl lg:text-[42px]">Make today count.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085] sm:text-base">Keep every task visible, focused, and moving forward.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e3e7ee] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(16,24,40,.035)]">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ecfdf7] font-black text-[#138a66]">i</span>
            <p className="max-w-xs text-xs font-medium leading-5 text-[#667085]">
              This is a demo API. Changes stay in this session; Refresh restores the sample data.
            </p>
          </div>
        </section>

        <TodoStats {...stats} loading={initialLoading} />
        <TodoForm creating={creating} onCreate={createTodo} />

        {loadError && todos.length > 0 && (
          <div role="alert" className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#f5c7bd] bg-[#fff4f1] p-4 text-sm text-[#8f2218] sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold">{loadError} Your current list is still available.</p>
            <button type="button" onClick={refresh} disabled={refreshing || isMutating} className="min-h-10 shrink-0 rounded-xl border border-[#e8a99d] bg-white px-4 text-xs font-extrabold transition hover:bg-[#fff9f7] disabled:opacity-50">Retry refresh</button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#e5e9f0] bg-white shadow-[0_12px_36px_rgba(16,24,40,.045)]" aria-labelledby="todo-list-heading">
          <div className="flex items-center justify-between gap-4 border-b border-[#edf0f4] px-4 py-4 sm:px-5">
            <div>
              <h2 id="todo-list-heading" className="text-base font-extrabold tracking-[-0.02em] text-[#182230]">Your todos</h2>
              <p aria-live="polite" className="mt-0.5 text-xs text-[#98a2b3]">
                {initialLoading ? 'Loading your workspace…' : hasActiveFilters ? `${filteredTodos.length} matching ${filteredTodos.length === 1 ? 'todo' : 'todos'}` : `${stats.total} ${stats.total === 1 ? 'todo' : 'todos'} in your workspace`}
              </p>
            </div>
            {!initialLoading && stats.total > 0 && (
              <span className="hidden rounded-full bg-[#f2f4f7] px-3 py-1.5 text-[11px] font-extrabold text-[#667085] sm:block">
                Showing {Math.min(visibleTodos.length, filteredTodos.length)} of {filteredTodos.length}
              </span>
            )}
          </div>

          <TodoToolbar
            query={query}
            filter={filter}
            counts={stats}
            onQueryChange={(value) => {
              setQuery(value);
              setVisibleCount(PAGE_SIZE);
            }}
            onFilterChange={(value) => {
              setFilter(value);
              setVisibleCount(PAGE_SIZE);
            }}
            onClear={clearFilters}
          />
          <TodoList
            allTodoCount={todos.length}
            filteredTodos={filteredTodos}
            visibleTodos={visibleTodos}
            initialLoading={initialLoading}
            initialError={loadError}
            hasActiveFilters={hasActiveFilters}
            busyItems={busyItems}
            onRetry={retry}
            onClearFilters={clearFilters}
            onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </section>

        <footer className="mt-7 flex flex-col gap-2 border-t border-[#e3e7ee] py-5 text-xs font-medium text-[#98a2b3] sm:flex-row sm:items-center sm:justify-between">
          <p>Built with React, Fetch, and the JSONPlaceholder REST API.</p>
          <p>GET · POST · PATCH · DELETE</p>
        </footer>
      </main>

      <FeedbackToast feedback={feedback} onDismiss={dismissFeedback} />
    </div>
  );
}
