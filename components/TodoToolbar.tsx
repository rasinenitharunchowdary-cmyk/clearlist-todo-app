import type { TodoFilter } from '@/types/todo';

type TodoToolbarProps = {
  query: string;
  filter: TodoFilter;
  counts: { total: number; completed: number; pending: number };
  onQueryChange: (value: string) => void;
  onFilterChange: (value: TodoFilter) => void;
  onClear: () => void;
};

export function TodoToolbar({ query, filter, counts, onQueryChange, onFilterChange, onClear }: TodoToolbarProps) {
  const filters: { value: TodoFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: counts.total },
    { value: 'pending', label: 'Pending', count: counts.pending },
    { value: 'completed', label: 'Completed', count: counts.completed },
  ];
  const hasFilters = query.length > 0 || filter !== 'all';

  return (
    <div className="border-b border-[#edf0f4] p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#98a2b3]">Filter by status</p>
          <div className="flex flex-wrap gap-2" aria-label="Todo status filters">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                onClick={() => onFilterChange(item.value)}
                className={`min-h-10 rounded-xl px-3.5 text-xs font-extrabold transition ${filter === item.value ? 'bg-[#eef0ff] text-[#4338ca] shadow-[inset_0_0_0_1px_rgba(79,70,229,.1)]' : 'bg-[#f8f9fb] text-[#667085] hover:bg-[#f0f2f5]'}`}
              >
                {item.label} <span className="ml-1 opacity-70">{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full xl:max-w-md">
          <label htmlFor="todo-search" className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#98a2b3]">Search todos</label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#98a2b3]">⌕</span>
              <input
                id="todo-search"
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search by title…"
                className="min-h-11 w-full rounded-xl border border-[#e1e5eb] bg-[#fafbfc] pl-9 pr-4 text-sm font-semibold text-[#344054] outline-none transition placeholder:font-normal placeholder:text-[#98a2b3] focus:border-[#635bdf] focus:bg-white focus:ring-4 focus:ring-[#4f46e5]/10"
              />
            </div>
            {hasFilters && (
              <button type="button" onClick={onClear} className="min-h-11 shrink-0 rounded-xl border border-[#e1e5eb] bg-white px-3 text-xs font-bold text-[#667085] transition hover:bg-[#f8f9fb]">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
