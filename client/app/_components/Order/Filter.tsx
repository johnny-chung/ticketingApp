"use client";

import { OrderStatus } from "@/app/_lib/data-service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";

export enum OrderFilterCode {
  All = "all",
  Created = OrderStatus.Created,
  Cancelled = OrderStatus.Cancelled,
  AwaitingPayment = OrderStatus.AwaitingPayment,
  Complete = OrderStatus.Complete,
}

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter: OrderFilterCode =
    (searchParams.get("filter") as OrderFilterCode) ?? "all";

  function handleFilter(filter: OrderFilterCode) {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  
  return (
    <div className="border border-primary-800 flex">
      <Button
        filter={OrderFilterCode.All}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All
      </Button>
      <Button
        filter={OrderFilterCode.Created}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        Pending
      </Button>
      <Button
        filter={OrderFilterCode.Complete}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        Complete
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
  filter: OrderFilterCode;
  handleFilter: (filter: OrderFilterCode) => void;
  activeFilter: OrderFilterCode;
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
