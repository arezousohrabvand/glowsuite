export function parseTimeTo24Hour(timeStr) {
  const [time, modifier] = String(timeStr || "").split(" ");
  let [hours, minutes] = String(time || "0:00")
    .split(":")
    .map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

export function parseDurationToMinutes(durationValue) {
  if (!durationValue) return 60;
  if (typeof durationValue === "number") return durationValue;

  const str = String(durationValue).toLowerCase();
  const hrMatch = str.match(/(\d+)\s*h/);
  const minMatch = str.match(/(\d+)\s*m/);
  const pureMinutesMatch = str.match(/(\d+)\s*min/);

  const hours = hrMatch ? Number(hrMatch[1]) : 0;
  const minutes = minMatch
    ? Number(minMatch[1])
    : pureMinutesMatch
      ? Number(pureMinutesMatch[1])
      : 0;

  return hours * 60 + minutes || 60;
}

export function buildSlotDates(dateStr, timeStr, durationMinutes = 60) {
  const { hours, minutes } = parseTimeTo24Hour(timeStr);

  const slotStart = new Date(dateStr);
  slotStart.setHours(hours, minutes, 0, 0);

  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

  return { slotStart, slotEnd };
}
