// order/pages.js

import { Suspense } from "react";
import { OrderFilterCode } from "../_components/Order/Filter";
import OrderList from "../_components/Order/OrderList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Order/Filter";

export const revalidate = 3600;

interface PageProps {
  filter?: string; // Adjust the key and type based on your dynamic route
}

export default async function Page({
  searchParams,
}: {
  searchParams: PageProps;
}) {
  const filter: OrderFilterCode =
    (searchParams?.filter as OrderFilterCode) ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">Your Order</h1>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      <Suspense fallback={<Spinner />} key={filter}>
        <OrderList filter={filter} />
      </Suspense>
    </div>
  );
}
