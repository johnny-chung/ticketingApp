// tickets/pages.js

import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import Filter, { TicketFilterCode } from "../_components/Ticket/Filter";
import TicketList from "../_components/Ticket/TicketList";

export const revalidate = 3600;

interface PageProps {
  filter?: string; // Adjust the key and type based on your dynamic route
}

export default async function Page({
  searchParams,
}: {
  searchParams: PageProps;
}) {
  const filter: TicketFilterCode =
    (searchParams?.filter as TicketFilterCode) ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Ticket On Sell
      </h1>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      <Suspense fallback={<Spinner />} key={filter}>
        <TicketList filter={filter} />
      </Suspense>
    </div>
  );
}
