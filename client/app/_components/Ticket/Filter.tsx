"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";

export enum TicketFilterCode {
  All = "all",
  Deal = "deal",
  Luxury = "luxury",
}

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter: TicketFilterCode =
    (searchParams.get("filter") as TicketFilterCode) ?? "all";

  function handleFilter(filter: TicketFilterCode) {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="border border-primary-800 flex">
      <Button
        filter={TicketFilterCode.All}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All Ticket
      </Button>
      <Button
        filter={TicketFilterCode.Deal}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        Deal
      </Button>
      <Button
        filter={TicketFilterCode.Luxury}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        Luxury
      </Button>
    </div>
  );
}

function Button({
  filter,
  handleFilter,
  activeFilter,
  children,
}: {
  filter: TicketFilterCode;
  handleFilter: (filter: TicketFilterCode) => void;
  activeFilter: TicketFilterCode;
  children: ReactNode;
}) {
  return (
    <button
      className={`px-4 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
