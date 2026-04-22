export default function TimeSlotPicker({ slots = [], selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`rounded-xl border px-3 py-2 ${
            selected === slot ? "bg-black text-white" : "bg-white"
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
