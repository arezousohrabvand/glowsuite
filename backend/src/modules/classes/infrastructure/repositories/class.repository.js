import ClassModel from "../mongoose/ClassModel.js";

export async function createClass(data) {
  return ClassModel.create(data);
}

export async function findClasses({
  page = 1,
  limit = 10,
  search,
  category,
  level,
} = {}) {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { instructorName: { $regex: search, $options: "i" } },
    ];
  }

  if (category) query.category = category;
  if (level) query.level = level;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    ClassModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ClassModel.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function findClassById(id) {
  return ClassModel.findById(id);
}

export async function updateClassById(id, data) {
  return ClassModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteClassById(id) {
  return ClassModel.findByIdAndDelete(id);
}
