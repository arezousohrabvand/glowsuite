import { toClassListResponse } from "../../contracts/class.mapper.js";
import { findClasses } from "../../infrastructure/repositories/class.repository.js";

export async function getClassesHandler(query) {
  const result = await findClasses({
    page: query.page || 1,
    limit: query.limit || 10,
    search: query.search,
    category: query.category,
    level: query.level,
  });

  return {
    items: toClassListResponse(result.items),
    pagination: result.pagination,
  };
}
