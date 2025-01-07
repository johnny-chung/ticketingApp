"use client";

import { newOrder } from "@/app/_lib/actions";
import { useTransition } from "react";
import SpinnerMini from "../SpinnerMini";

function OrderTicket({
  ticketId,
  session,
}: {
  ticketId: string;
  session: string;
}) {
  // possible to put the server action in the code
  // function deleteReservation() {
  // need to add use sever as if we put DeleteResercation in a client component
  //  -> it become one as well
  //   "use server";
  //   // code
  // }

  const [isPending, startTransition] = useTransition();

  function handleOrder() {
    if (confirm("Order this ticket?"))
      // for optimistic -> let the list call server action
      // if don't use optimistic -> call server action directly:
      // startTransition(() => deleteReservation(bookingId));
      startTransition(async () => await newOrder(ticketId, session));
  }

  return (
    <button
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
      onClick={handleOrder}
    >
      {isPending ? (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      ) : (
        <span className="mt-1">Order</span>
      )}
    </button>
  );
}

export default OrderTicket;
