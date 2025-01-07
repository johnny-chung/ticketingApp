import { getTicket } from "@/app/_lib/data-service";
import React from "react";
import TicketDetails from "../../_components/Ticket/TicketDetails";

import { cookies } from "next/headers";

interface PageProps {
  ticketId: string; // Adjust the key and type based on your dynamic route
}

export default async function page({ params }: { params: PageProps }) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  console.log("in ticket detail page");

  const ticket = await getTicket(params.ticketId, sessionCookie);
  if (!ticket) return null;

  //return <p>{params.ticketId}</p>;
  return (
    <div>
      <TicketDetails ticket={ticket} />
    </div>
  );
}
