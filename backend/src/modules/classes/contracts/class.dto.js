export function createClassDto(body) {
  return {
    title: body.title,
    category: body.category,
    description: body.description,

    instructorName: body.instructorName,

    price: Number(body.price),
    capacity: Number(body.capacity),

    date: body.date,
    time: body.time,

    image: body.image,
    duration: body.duration,

    level: body.level || "Beginner",
    status: body.status || "active",

    tags: body.tags || [],
    isActive: body.isActive ?? true,
  };
}

export function updateClassDto(body) {
  const dto = {};

  const allowedFields = [
    "title",
    "category",
    "description",
    "instructorName",
    "price",
    "capacity",
    "date",
    "time",
    "image",
    "duration",
    "level",
    "status",
    "tags",
    "isActive",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      dto[field] = body[field];
    }
  }

  if (dto.price !== undefined) dto.price = Number(dto.price);
  if (dto.capacity !== undefined) dto.capacity = Number(dto.capacity);

  return dto;
}
