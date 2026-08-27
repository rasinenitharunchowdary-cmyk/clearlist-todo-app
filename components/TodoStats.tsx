type TodoStatsProps = {
  total: number;
  completed: number;
  pending: number;
  loading: boolean;
};

const cards = [
  { key: 'total', label: 'Total tasks', note: 'Across your workspace', dot: 'bg-[#4f46e5]' },
  { key: 'completed', label: 'Completed', note: 'Progress worth keeping', dot: 'bg-[#20b486]' },
  { key: 'pending', label: 'Still pending', note: 'Ready for your focus', dot: 'bg-[#f79009]' },
] as const;

export function TodoStats({ total, completed, pending, loading }: TodoStatsProps) {
  const values = { total, completed, pending };
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section aria-label="Todo summary" className="mb-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
      {cards.map((card) => (
        <article key={card.key} className="rounded-2xl border border-[#e5e9f0] bg-white p-4 shadow-[0_8px_30px_rgba(16,24,40,.035)] sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#667085]">{card.label}</p>
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${card.dot}`} />
          </div>
          {loading ? (
            <span className="block h-9 w-16 animate-pulse rounded-lg bg-[#eef1f5]" />
          ) : (
            <p className="text-3xl font-extrabold tracking-[-0.05em] text-[#182230]">{values[card.key]}</p>
          )}
          <p className="mt-1 text-xs text-[#98a2b3]">
            {card.key === 'completed' && total ? `${completionRate}% of all tasks` : card.note}
          </p>
        </article>
      ))}
    </section>
  );
}
