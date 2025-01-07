import { TicketAttr } from "@/app/_lib/data-service";
import React from "react";
import Link from "next/link";
import OrderTicket from "./OrderTicket";
import { cookies } from "next/headers";

export default function TicketDetails({ ticket }: { ticket: TicketAttr }) {
  const { id, title, price, userId, orderId, version } = ticket;
  const session = cookies().get("session")?.value ?? "";

  return (
    <div className="flex border-primary-800 border">
      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-primary-950">
          <h3 className="text-accent-500 font-semibold text-2xl mb-3">
            Ticket {title}
          </h3>

          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              Ticket ID: <span className="font-bold">{id}</span>
            </p>
          </div>
          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              Seller ID: <span className="font-bold">{userId}</span>
            </p>
          </div>

          <p className="flex gap-3 justify-end items-baseline">
            <span className="text-3xl font-[350]">${price}</span>
            <span className="text-primary-200">/ ticket</span>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 text-right">
          <OrderTicket ticketId={ticket.id} session={session} />
        </div>
      </div>
    </div>
  );
}
