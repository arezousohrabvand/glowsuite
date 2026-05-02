export default function PaginationControls({ page, pagination, setPage }) {
  const totalPages = pagination?.pages || 1;

  if (totalPages <= 1) return null;

  const maxVisible = 5;

  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="rounded-full border px-4 py-2 text-sm disabled:opacity-40"
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="rounded-full border px-4 py-2 text-sm"
          >
            1
          </button>
          {start > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`rounded-full border px-4 py-2 text-sm ${
            page === p
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => setPage(totalPages)}
            className="rounded-full border px-4 py-2 text-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="rounded-full border px-4 py-2 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}