'use client';

import { FormEvent, useRef, useState } from 'react';

type TodoFormProps = {
  creating: boolean;
  onCreate: (title: string, completed: boolean) => Promise<boolean>;
};

const TITLE_LIMIT = 120;

export function TodoForm({ creating, onCreate }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      setError('Enter a todo title before adding it.');
      inputRef.current?.focus();
      return;
    }

    if (nextTitle.length > TITLE_LIMIT) {
      setError(`Keep the title to ${TITLE_LIMIT} characters or fewer.`);
      inputRef.current?.focus();
      return;
    }

    setError('');
    const created = await onCreate(nextTitle, completed);
    if (created) {
      setTitle('');
      setCompleted(false);
      inputRef.current?.focus();
    }
  };

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-[#dfe2f4] bg-[#f0f1ff] shadow-[0_12px_34px_rgba(79,70,229,.07)]">
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <label htmlFor="new-todo" className="text-sm font-extrabold text-[#25245b]">Add a new todo</label>
            <span className="text-[11px] font-medium text-[#7c7ab2]">{title.length}/{TITLE_LIMIT}</span>
          </div>
          <input
            ref={inputRef}
            id="new-todo"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (error) setError('');
            }}
            maxLength={TITLE_LIMIT + 1}
            disabled={creating}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'new-todo-error' : 'new-todo-hint'}
            placeholder="What would you like to get done?"
            className="min-h-12 w-full rounded-xl border border-[#d6d8ef] bg-white px-4 text-sm font-semibold text-[#344054] shadow-sm outline-none transition placeholder:font-normal placeholder:text-[#98a2b3] focus:border-[#635bdf] focus:ring-4 focus:ring-[#4f46e5]/10 disabled:cursor-not-allowed disabled:bg-[#f7f7fa]"
          />
          {error ? (
            <p id="new-todo-error" role="alert" className="mt-2 text-xs font-semibold text-[#c4320a]">{error}</p>
          ) : (
            <p id="new-todo-hint" className="mt-2 text-xs text-[#7c7ab2]">Creates a new item through the public REST API.</p>
          )}
        </div>

        <label className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border border-[#d6d8ef] bg-white px-4 text-sm font-bold text-[#525083] shadow-sm">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => setCompleted(event.target.checked)}
            disabled={creating}
            className="h-4 w-4 accent-[#4f46e5]"
          />
          Already completed
        </label>

        <button
          type="submit"
          disabled={creating}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4f46e5] px-5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(79,70,229,.22)] transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {creating ? 'Adding todo' : '+ Add todo'}
        </button>
      </form>
    </section>
  );
}
