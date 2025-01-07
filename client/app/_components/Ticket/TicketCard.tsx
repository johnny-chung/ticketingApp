import { TicketAttr } from "@/app/_lib/data-service";
import React from "react";
import Link from "next/link";

export default function TicketCard({ ticket }: { ticket: TicketAttr }) {
  return (
    <div className="flex border-primary-800 border">
      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-primary-950">
          <h3 className="text-accent-500 font-semibold text-2xl mb-3">
            Ticket ID: {ticket.id}
          </h3>

          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              <span className="font-bold">{ticket.title}</span>
            </p>
          </div>

          <p className="flex gap-3 justify-end items-baseline">
            <span className="text-3xl font-[350]">${ticket.price}</span>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 text-right">
          <Link
            href={`/tickets/${ticket.id}`}
            className="border-l border-primary-800 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-900"
          >
            Reserve &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
