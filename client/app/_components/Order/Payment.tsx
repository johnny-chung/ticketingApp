"use client";

import { createPaymentIntent } from "@/app/_lib/actions";
import { isBefore } from "date-fns";
import { useEffect, useState } from "react";

function Payment({
  orderId,
  session,
  expiresAt,
}: {
  orderId: string;
  session: string | undefined;
  expiresAt: Date;
}) {
  const [isExpired, setIsExpired] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const expirationCheck = isBefore(new Date(), expiresAt);
      setIsExpired(!expirationCheck);
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [expiresAt]);

  async function handlePayment() {
    if (confirm("Payment?")) {
      const secret = await createPaymentIntent(orderId, session);
      setClientSecret(secret);
    }
  }

  return (
    <div>
      {!isExpired ? (
        <button
          className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
          onClick={handlePayment}
        >
          <span className="mt-1">Pay</span>
          {clientSecret && <p>{clientSecret}</p>}
        </button>
      ) : (
        <p className="text-red-500">
          Time is up. Payment is no longer available.
        </p>
      )}
    </div>
  );
}

export default Payment;
