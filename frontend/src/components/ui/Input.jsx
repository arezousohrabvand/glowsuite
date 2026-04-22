export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100 ${className}`}
        {...props}
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
