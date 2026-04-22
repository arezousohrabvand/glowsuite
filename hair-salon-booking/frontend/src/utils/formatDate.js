import { useMemo, useState } from "react";

export default function usePagination(data = [], perPage = 6) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / perPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, page, perPage]);

  return {
    page,
    setPage,
    totalPages,
    paginatedData,
  };
}
