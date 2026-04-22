function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

export default function CheckoutPreviewCard({
  preview,
  couponCode,
  setCouponCode,
  stateCode,
  setStateCode,
  onPreview,
  onCheckout,
  loading,
}) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">
        Checkout Preview
      </p>

      <h2 className="mt-2 text-2xl font-bold text-zinc-900">
        {preview?.title || "Review your payment"}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            State
          </label>
          <input
            type="text"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value.toUpperCase())}
            placeholder="TX"
            maxLength={2}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-rose-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Coupon Code
          </label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="SAVE10"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-rose-400"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onPreview}
          disabled={loading}
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900"
        >
          Refresh Preview
        </button>

        <button
          onClick={onCheckout}
          disabled={loading}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Continue to Stripe
        </button>
      </div>

      {preview ? (
        <div className="mt-6 rounded-3xl border border-zinc-100 bg-zinc-50 p-5">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                {formatMoney(preview.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-semibold">
                - {formatMoney(preview.discountAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>
                Tax ({(Number(preview.taxRate || 0) * 100).toFixed(2)}%)
              </span>
              <span className="font-semibold">
                {formatMoney(preview.taxAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold">{formatMoney(preview.total)}</span>
            </div>

            <div className="pt-2 text-zinc-500">
              State: {preview.taxState || "TX"}{" "}
              {preview.couponCode ? `• Coupon: ${preview.couponCode}` : ""}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
