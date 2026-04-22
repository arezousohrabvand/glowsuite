import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white px-6 py-14">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-amber-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-600">
          Payment Cancelled
        </p>

        <h1 className="mt-2 text-4xl font-bold text-zinc-900">
          Your payment was not completed
        </h1>

        <p className="mt-4 text-zinc-600">
          No worries. You can go back and try checkout again when you are ready.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            to="/dashboard"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
