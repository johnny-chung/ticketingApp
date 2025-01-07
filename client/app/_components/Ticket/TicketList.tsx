import React from "react";

import { cookies } from "next/headers";
import { TicketFilterCode } from "./Filter";
import { getTicketList } from "@/app/_lib/data-service";
import TicketCard from "./TicketCard";

export default async function TicketList({ filter }: { filter: TicketFilterCode }) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  const tickets = await getTicketList(sessionCookie);

  if (!tickets.length) return null;

  let filteredTickets;
  switch (filter as TicketFilterCode) {
    case TicketFilterCode.Deal:
    case "deal":
      filteredTickets = tickets.filter((ticket) => ticket.price <= 30);
      break;
    case TicketFilterCode.Luxury:
    case "luxury":
      filteredTickets = tickets.filter((ticket) => ticket.price > 30);
      break;

    default:
      filteredTickets = tickets;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredTickets.map((ticket) => (
        <TicketCard ticket={ticket} key={ticket.id} />
      ))}
    </div>
  );
}
