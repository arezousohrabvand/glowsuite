import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CheckoutPreviewCard from "../components/billing/CheckoutPreviewCard";
import { createCheckout, previewCheckout } from "../api/paymentApi";

export default function ClassPayment() {
  const { enrollmentId } = useParams();
  const [couponCode, setCouponCode] = useState("");
  const [stateCode, setStateCode] = useState("TX");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPreview = async () => {
    try {
      setLoading(true);
      const data = await previewCheckout({
        type: "class",
        enrollmentId,
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
    try {
      setLoading(true);
      const data = await createCheckout({
        type: "class",
        enrollmentId,
        couponCode,
        state: stateCode,
      });

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create checkout");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [enrollmentId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
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
