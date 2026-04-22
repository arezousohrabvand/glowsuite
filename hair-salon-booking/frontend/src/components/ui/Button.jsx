export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const styles =
    variant === "secondary"
      ? "bg-white text-[#574d40] border border-[#d8d3c9] hover:bg-[#f7f6f4]"
      : variant === "ghost"
        ? "bg-transparent text-[#574d40] hover:bg-[#f7f6f4]"
        : "bg-[#6f6250] text-white hover:bg-[#574d40] shadow-sm";

  return (
    <button
      className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
