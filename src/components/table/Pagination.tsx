import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  total: number;
  maxButtons?: number;
}

const getPageNumbers = (totalPages: number, currentPage: number, maxButtons = 7) => {
  if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);
  if (start === 1) end = maxButtons;
  if (end === totalPages) start = totalPages - maxButtons + 1;
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function Pagination({ page, setPage, pageSize, setPageSize, total, maxButtons = 7 }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handleCustomRows = (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value || '0', 10) || 0;
    const clamped = Math.max(1, Math.min(500, v));
    setPageSize(clamped);
  };

  return (
    <div className="p-8 border-t border-outline-variant/10 flex items-center justify-center bg-surface-container-low/10 gap-4 flex-wrap">
      <span className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider">Showing {total === 0 ? 0 : startIndex}-{endIndex} of {total}</span>

      <div className="flex items-center gap-1">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 hover:bg-surface-container rounded-sm transition-colors border border-outline-variant/20"><ChevronLeft size={16} /></button>
        <div className="text-sm font-mono px-2">{page} / {totalPages}</div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 hover:bg-surface-container rounded-sm transition-colors border border-outline-variant/20"><ChevronRight size={16} /></button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs text-on-surface-variant">Rows:</label>
        <select value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))} className="bg-surface-container w-24 rounded-md">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <nav className="flex items-center gap-1">
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container rounded-md transition-colors border border-outline-variant/20"
        >
          <ChevronLeft size={18} />
        </button>
        {(() => {
          const pageNumbers = getPageNumbers(totalPages, page, maxButtons);
          const first = pageNumbers[0];
          const last = pageNumbers[pageNumbers.length - 1];
          const nodes: any[] = [];

          if (first > 1) {
            nodes.push(
              <button key={1} onClick={() => setPage(1)} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">1</button>
            );
            if (first > 2) nodes.push(<span key="start-ellipsis" className="w-10 h-10 flex items-center justify-center text-on-surface-variant/30">...</span>);
          }

          pageNumbers.forEach((p) => {
            nodes.push(
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center font-mono font-bold rounded-md transition-colors border ${p === page ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                {p}
              </button>
            );
          });

          if (last < totalPages) {
            if (last < totalPages - 1) nodes.push(<span key="end-ellipsis" className="w-10 h-10 flex items-center justify-center text-on-surface-variant/30">...</span>);
            nodes.push(
              <button key={totalPages} onClick={() => setPage(totalPages)} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">{totalPages}</button>
            );
          }

          return nodes;
        })()}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container rounded-md transition-colors border border-outline-variant/20"
        >
          <ChevronRight size={18} />
        </button>
      </nav>

      <div className="ml-6 flex items-center gap-3">
        <label className="text-xs text-on-surface-variant">Custom rows per page:</label>
        <input
          type="number"
          min={1}
          max={500}
          value={String(pageSize)}
          onChange={handleCustomRows}
          className="w-20 h-8 bg-surface-container px-2 rounded-md text-sm outline-none"
        />
      </div>
    </div>
  );
}

export default Pagination;
