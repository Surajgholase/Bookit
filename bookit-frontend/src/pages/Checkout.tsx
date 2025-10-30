import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface Discount {
  type: "percent" | "fixed";
  value: number;
}

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const expId = searchParams.get("expId");
  const slotId = searchParams.get("slotId");
  const expName = searchParams.get("expName");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const basePrice = Number(searchParams.get("price"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const taxes = 59; // From screenshot
  const subtotal = basePrice;
  let finalPrice = subtotal + taxes;

  if (discount) {
    if (discount.type === "percent") {
      finalPrice -= (subtotal * discount.value) / 100;
    } else if (discount.type === "fixed") {
      finalPrice -= discount.value;
    }
  }
  if (finalPrice < 0) finalPrice = 0;

  const handleValidatePromo = async () => {
    if (!promoCode) return;
    setIsApplyingPromo(true);
    setPromoError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/promo/validate",
        { promo_code: promoCode }
      );
      if (response.data.valid) {
        setDiscount(response.data.discount);
      }
    } catch (err) {
      setDiscount(null);
      setPromoError("Invalid promo code.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setBookingError("You must agree to the terms and safety policy.");
      return;
    }

    setIsSubmitting(true);
    setBookingError("");

    try {
      const response = await axios.post("http://localhost:5000/bookings", {
        experience_id: expId,
        slot_id: slotId,
        user_name: name,
        user_email: email,
        promo_code: discount ? promoCode : undefined,
        final_price: finalPrice,
      });

      navigate(
        `/result?status=success&refId=${response.data.booking._id
          .slice(-8)
          .toUpperCase()}`
      );
    } catch (err: any) {
      let message = "Booking failed. Please try again.";
      if (err.response && err.response.status === 409) {
        message = "Sorry, this slot just became full.";
      }
      setBookingError(message);
      setIsSubmitting(false);
    }
  };

  if (!expId || !slotId || !basePrice) {
    return (
      <div className="text-center p-10 text-red-500">
        <h1 className="text-2xl">Error: Missing booking details.</h1>
        <Link to="/" className="text-blue-600">
          &larr; Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full">
      <div className="container mx-auto max-w-6xl p-8">
        <Link
          to={`/experience/${expId}`}
          className="text-sm font-medium text-gray-700 hover:text-black mb-6 inline-block">
          &larr; Checkout
        </Link>

        <form
          onSubmit={handleSubmitBooking}
          className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 bg-gray-50 rounded-lg shadow-lg border border-gray-200 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="promo"
                className="block text-sm font-medium text-gray-700 mb-1">
                Promo code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  disabled={!!discount}
                />
                <button
                  type="button"
                  onClick={handleValidatePromo}
                  disabled={isApplyingPromo || !!discount}
                  className="px-6 py-2 bg-gray-800 text-white text-sm font-semibold rounded-md shadow disabled:opacity-50">
                  {isApplyingPromo ? "..." : "Apply"}
                </button>
              </div>
              {promoError && (
                <p className="text-sm text-red-500 mt-2">{promoError}</p>
              )}
              {discount && (
                <p className="text-sm text-green-600 mt-2">
                  "{promoCode}" applied!
                </p>
              )}
            </div>

            <div className="flex items-center pt-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700">
                I agree to the terms and safety policy
              </label>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Experience</span>
                <span className="text-gray-900 font-semibold">{expName}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900 font-semibold">{date}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Time</span>
                <span className="text-gray-900 font-semibold">{time}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Qty</span>
                <span className="text-gray-900 font-semibold">1</span>
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="flex justify-between text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-semibold">
                  ₹{subtotal.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Taxes</span>
                <span className="text-gray-900 font-semibold">
                  ₹{taxes.toFixed(0)}
                </span>
              </div>

              {discount && (
                <div className="flex justify-between text-base text-green-600">
                  <span className="text-gray-600">Discount ({promoCode})</span>
                  <span className="font-semibold">
                    - ₹{(subtotal + taxes - finalPrice).toFixed(0)}
                  </span>
                </div>
              )}

              <hr className="my-4 border-gray-200" />

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">Total</span>
                <span className="text-2xl font-bold">
                  ₹{finalPrice.toFixed(0)}
                </span>
              </div>

              {bookingError && (
                <p className="text-center text-red-500 text-sm mt-4">
                  {bookingError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !agreed}
                className="w-full mt-6 py-3 bg-yellow-400 text-black text-lg font-semibold rounded-lg shadow
                  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                  hover:bg-yellow-500 transition-colors">
                {isSubmitting ? "Processing..." : "Pay and Confirm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
