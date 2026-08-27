'use client';

import { FormEvent, useState } from 'react';
import type { Todo, TodoChanges } from '@/types/todo';

type TodoItemProps = {
  todo: Todo;
  busy: boolean;
  onUpdate: (todo: Todo, changes: Partial<TodoChanges>) => Promise<boolean>;
  onDelete: (todo: Todo) => Promise<boolean>;
};

export function TodoItem({ todo, busy, onUpdate, onDelete }: TodoItemProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [validationError, setValidationError] = useState('');

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      setValidationError('Todo title cannot be empty.');
      return;
    }

    if (nextTitle.length > 120) {
      setValidationError('Keep the title to 120 characters or fewer.');
      return;
    }

    setValidationError('');
    const saved = await onUpdate(todo, { title: nextTitle, completed });
    if (saved) setMode('view');
  };

  const cancelEdit = () => {
    setTitle(todo.title);
    setCompleted(todo.completed);
    setValidationError('');
    setMode('view');
  };

  if (mode === 'edit') {
    return (
      <li className="bg-[#fafaff] p-4 sm:p-5">
        <form onSubmit={handleEdit} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div>
            <label htmlFor={`edit-${todo.clientId}`} className="mb-2 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#667085]">Edit todo</label>
            <input
              id={`edit-${todo.clientId}`}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (validationError) setValidationError('');
              }}
              autoFocus
              disabled={busy}
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? `edit-error-${todo.clientId}` : undefined}
              maxLength={121}
              className="min-h-11 w-full rounded-xl border border-[#d6d8ef] bg-white px-4 text-sm font-semibold text-[#344054] outline-none transition focus:border-[#635bdf] focus:ring-4 focus:ring-[#4f46e5]/10"
            />
            {validationError && <p id={`edit-error-${todo.clientId}`} role="alert" className="mt-2 text-xs font-semibold text-[#c4320a]">{validationError}</p>}
            <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-bold text-[#667085]">
              <input type="checkbox" checked={completed} onChange={(event) => setCompleted(event.target.checked)} disabled={busy} className="h-4 w-4 accent-[#4f46e5]" />
              Mark as completed
            </label>
          </div>
          <div className="flex flex-wrap gap-2 lg:pt-6">
            <button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#4f46e5] px-4 text-xs font-extrabold text-white transition hover:bg-[#4338ca] disabled:opacity-50">
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={cancelEdit} disabled={busy} className="min-h-11 rounded-xl border border-[#dfe3ea] bg-white px-4 text-xs font-extrabold text-[#667085] transition hover:bg-[#f8f9fb] disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  if (mode === 'delete') {
    return (
      <li className="flex flex-col gap-4 bg-[#fff9f7] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" role="group" aria-label={`Delete ${todo.title}`}>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[#7a271a]">Delete this todo?</p>
          <p className="mt-1 truncate text-sm text-[#b54708]">{todo.title}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              const deleted = await onDelete(todo);
              if (!deleted) setMode('view');
            }}
            className="min-h-11 rounded-xl bg-[#d92d20] px-4 text-xs font-extrabold text-white transition hover:bg-[#b42318] disabled:opacity-50"
          >
            {busy ? 'Deleting…' : 'Yes, delete'}
          </button>
          <button type="button" disabled={busy} onClick={() => setMode('view')} className="min-h-11 rounded-xl border border-[#f3c7bf] bg-white px-4 text-xs font-extrabold text-[#7a271a] transition hover:bg-[#fff4f1] disabled:opacity-50">
            Keep it
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex flex-col gap-4 p-4 transition hover:bg-[#fafbfc] sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:items-center">
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdate(todo, { completed: !todo.completed })}
          aria-label={todo.completed ? `Mark ${todo.title} as pending` : `Mark ${todo.title} as completed`}
          aria-pressed={todo.completed}
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4f46e5] disabled:cursor-wait sm:mt-0 ${todo.completed ? 'border-[#20b486] bg-[#20b486] text-white' : 'border-[#cfd5df] bg-white text-transparent hover:border-[#4f46e5]'}`}
        >
          {busy ? <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> : '✓'}
        </button>

        <div className="min-w-0 flex-1">
          <p className={`break-words text-sm font-bold leading-5 ${todo.completed ? 'text-[#98a2b3] line-through decoration-[#b7bec8]' : 'text-[#344054]'}`}>{todo.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-[#98a2b3]">
            <span>Todo #{todo.id}</span>
            <span aria-hidden="true">·</span>
            <span>User {todo.userId}</span>
            {todo.isLocal && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-bold text-[#635bdf]">Added this session</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="ml-10 flex flex-wrap items-center gap-2 sm:ml-0 sm:justify-end">
        <span className={`mr-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${todo.completed ? 'bg-[#eafaf4] text-[#138a66]' : 'bg-[#fff6e8] text-[#b54708]'}`}>
          {todo.completed ? 'Completed' : 'Pending'}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setTitle(todo.title);
            setCompleted(todo.completed);
            setMode('edit');
          }}
          className="min-h-10 rounded-lg border border-[#e3e6eb] bg-white px-3 text-xs font-extrabold text-[#667085] transition hover:border-[#cdd2da] hover:text-[#344054] disabled:opacity-50"
        >
          Edit
        </button>
        <button type="button" disabled={busy} onClick={() => setMode('delete')} className="min-h-10 rounded-lg px-3 text-xs font-extrabold text-[#b42318] transition hover:bg-[#fff1ee] disabled:opacity-50">
          Delete
        </button>
      </div>
    </li>
  );
}
