import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CheckoutPreviewCard from "../components/billing/CheckoutPreviewCard";
import { createCheckout, previewCheckout } from "../api/paymentApi";

export default function BookingPayment() {
  const params = useParams();
  const bookingId = params.bookingId || params.id;

  const [couponCode, setCouponCode] = useState("");
  const [stateCode, setStateCode] = useState("TX");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPreview = async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      const data = await previewCheckout({
        type: "booking",
        bookingId,
        couponCode,
        state: stateCode,
      });
      setPreview(data);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to preview payment");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!bookingId) {
      alert("Booking ID is missing.");
      return;
    }

    try {
      setLoading(true);
      const data = await createCheckout({
        type: "booking",
        bookingId,
        couponCode,
        state: stateCode,
      });

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      alert("Checkout session was created but no Stripe URL was returned.");
      setLoading(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create checkout");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      loadPreview();
    }
  }, [bookingId]);

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Booking ID is missing from the URL.
          </div>

          <div className="mt-6">
            <Link
              to="/my-bookings"
              className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
            >
              ← Back to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            to="/my-bookings"
            className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50"
          >
            ← Back to My Bookings
          </Link>
        </div>

        <CheckoutPreviewCard
          preview={preview}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          stateCode={stateCode}
          setStateCode={setStateCode}
          onPreview={loadPreview}
          onCheckout={handleCheckout}
          loading={loading}
        />
      </div>
    </div>
  );
}
