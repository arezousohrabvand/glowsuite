export function toClassResponse(classDoc) {
  if (!classDoc) return null;

  return {
    id: classDoc._id,
    title: classDoc.title,
    category: classDoc.category,
    description: classDoc.description,

    instructorName: classDoc.instructorName,

    price: classDoc.price,
    capacity: classDoc.capacity,
    enrolledCount: classDoc.enrolledCount || 0,

    availableSeats: Math.max(
      (classDoc.capacity || 0) - (classDoc.enrolledCount || 0),
      0,
    ),

    date: classDoc.date,
    time: classDoc.time,

    image: classDoc.image,
    duration: classDoc.duration,
    level: classDoc.level,
    status: classDoc.status,

    tags: classDoc.tags || [],
    isActive: classDoc.isActive,

    createdAt: classDoc.createdAt,
    updatedAt: classDoc.updatedAt,
  };
}

export function toClassListResponse(classes = []) {
  return classes.map(toClassResponse);
}
