import { TodoItem } from '@/components/TodoItem';
import type { Todo, TodoChanges } from '@/types/todo';

type TodoListProps = {
  allTodoCount: number;
  filteredTodos: Todo[];
  visibleTodos: Todo[];
  initialLoading: boolean;
  initialError: string | null;
  hasActiveFilters: boolean;
  busyItems: Set<string>;
  onRetry: () => void;
  onClearFilters: () => void;
  onLoadMore: () => void;
  onUpdate: (todo: Todo, changes: Partial<TodoChanges>) => Promise<boolean>;
  onDelete: (todo: Todo) => Promise<boolean>;
};

function LoadingRows() {
  return (
    <div role="status" aria-label="Loading todos" className="divide-y divide-[#edf0f4]">
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex items-center gap-4 p-5">
          <span className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-[#e9ecf1]" />
          <div className="flex-1">
            <span className="block h-3.5 animate-pulse rounded bg-[#e9ecf1]" style={{ width: `${58 + row * 7}%` }} />
            <span className="mt-2 block h-2.5 w-24 animate-pulse rounded bg-[#f0f2f5]" />
          </div>
          <span className="hidden h-7 w-20 animate-pulse rounded-full bg-[#f0f2f5] sm:block" />
        </div>
      ))}
      <span className="sr-only">Loading todos…</span>
    </div>
  );
}

export function TodoList({ allTodoCount, filteredTodos, visibleTodos, initialLoading, initialError, hasActiveFilters, busyItems, onRetry, onClearFilters, onLoadMore, onUpdate, onDelete }: TodoListProps) {
  if (initialLoading) return <LoadingRows />;

  if (initialError && allTodoCount === 0) {
    return (
      <div className="grid min-h-72 place-items-center p-6 text-center">
        <div className="max-w-sm">
          <span aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fff1ee] text-xl font-black text-[#d92d20]">!</span>
          <h2 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-[#182230]">We couldn’t load your todos</h2>
          <p className="mt-2 text-sm leading-6 text-[#667085]">{initialError}</p>
          <button type="button" onClick={onRetry} className="mt-5 min-h-11 rounded-xl bg-[#4f46e5] px-5 text-sm font-extrabold text-white transition hover:bg-[#4338ca]">Try again</button>
        </div>
      </div>
    );
  }

  if (allTodoCount === 0) {
    return (
      <div className="grid min-h-72 place-items-center p-6 text-center">
        <div className="max-w-sm">
          <span aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eef0ff] text-xl font-black text-[#4f46e5]">✓</span>
          <h2 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-[#182230]">Your list is wide open</h2>
          <p className="mt-2 text-sm leading-6 text-[#667085]">No todos are available yet. Add your first task above to get started.</p>
        </div>
      </div>
    );
  }

  if (filteredTodos.length === 0 && hasActiveFilters) {
    return (
      <div className="grid min-h-72 place-items-center p-6 text-center">
        <div className="max-w-sm">
          <span aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f2f4f7] text-lg font-black text-[#667085]">⌕</span>
          <h2 className="mt-4 text-lg font-extrabold tracking-[-0.02em] text-[#182230]">No matching todos</h2>
          <p className="mt-2 text-sm leading-6 text-[#667085]">Try another search or clear the active status filter.</p>
          <button type="button" onClick={onClearFilters} className="mt-5 min-h-11 rounded-xl border border-[#dfe3ea] bg-white px-5 text-sm font-extrabold text-[#475467] transition hover:bg-[#f8f9fb]">Clear filters</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-[#edf0f4]" aria-label="Todo list">
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.clientId}
            todo={todo}
            busy={busyItems.has(todo.clientId)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
      {visibleTodos.length < filteredTodos.length && (
        <div className="border-t border-[#edf0f4] bg-[#fafbfc] p-4 text-center">
          <button type="button" onClick={onLoadMore} className="min-h-11 rounded-xl border border-[#dfe3ea] bg-white px-5 text-sm font-extrabold text-[#475467] shadow-sm transition hover:border-[#cdd2da] hover:bg-[#f8f9fb]">
            Show more <span className="ml-1 text-[#98a2b3]">({filteredTodos.length - visibleTodos.length} remaining)</span>
          </button>
        </div>
      )}
    </>
  );
}
