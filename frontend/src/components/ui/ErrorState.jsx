export default function ErrorState({ message = "Something went wrong" }) {
  return (
    <div className="rounded-2xl bg-red-50 p-8 text-center text-red-600">
      {message}
    </div>
  );
}
