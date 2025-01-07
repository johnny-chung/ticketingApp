import { OrderStatus, getOrderList } from "@/app/_lib/data-service";
import { cookies } from "next/headers";
import { OrderFilterCode } from "./Filter";
import OrderCard from "./OrderCard";

export default async function OrderList({
  filter,
}: {
  filter: OrderFilterCode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  const orders = await getOrderList(sessionCookie);

  if (!orders.length) return null;

  let filteredOrders;
  switch (filter as OrderFilterCode) {
    case OrderFilterCode.Complete:
    case "created":
      filteredOrders = orders.filter(
        (order) => order.status === OrderStatus.Complete
      );
      break;
    case OrderFilterCode.Created:
    case "created":
      filteredOrders = orders.filter(
        (order) =>
          order.status === OrderStatus.Created ||
          order.status === OrderStatus.AwaitingPayment
      );
      break;

    default:
      filteredOrders = orders;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredOrders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </div>
  );
}
