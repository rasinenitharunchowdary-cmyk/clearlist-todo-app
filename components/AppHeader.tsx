type AppHeaderProps = {
  refreshing: boolean;
  refreshDisabled: boolean;
  onRefresh: () => void;
};

export function AppHeader({ refreshing, refreshDisabled, onRefresh }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e7eaf0] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8 lg:px-10">
        <a href="#main-content" className="flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4f46e5]">
          <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#4f46e5] text-lg font-black text-white shadow-[0_8px_22px_rgba(79,70,229,.24)]">
            ✓
          </span>
          <span>
            <span className="block text-[17px] font-extrabold tracking-[-0.03em] text-[#182230]">ClearList</span>
            <span className="block text-[11px] font-medium text-[#7c8798]">Todo workspace</span>
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-[#e5e9f0] bg-[#fafbfc] px-3 py-2 text-[11px] font-bold text-[#667085] sm:flex">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#20b486] shadow-[0_0_0_3px_rgba(32,180,134,.12)]" />
            JSONPlaceholder API
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshDisabled || refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe3ea] bg-white px-3.5 text-sm font-bold text-[#475467] shadow-sm transition hover:border-[#c8ced8] hover:bg-[#fafbfc] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <span aria-hidden="true" className={refreshing ? 'inline-block animate-spin' : ''}>↻</span>
            <span>{refreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
