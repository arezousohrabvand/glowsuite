import Input from "../ui/Input";

export default function ClassFilters({ value, onChange }) {
  return (
    <div className="mb-6 max-w-md">
      <Input
        label="Search classes"
        placeholder="Search by title or instructor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
