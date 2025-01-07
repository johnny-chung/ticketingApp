import OrderDetails from "@/app/_components/Order/OrderDetails";
import Payment from "@/app/_components/Order/Payment";
import Timer from "@/app/_components/Timer/Timer";
import { OrderStatus, getOrder } from "@/app/_lib/data-service";
import { cookies } from "next/headers";

export const metadata = {
  title: "Order Details",
};

interface PageProps {
  orderId: string; // Adjust the key and type based on your dynamic route
}

export default async function Page({ params }: { params: PageProps }) {
  const session = cookies().get("session")?.value;

  const order = await getOrder(params.orderId, session);
  if (!order) return null;

  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <OrderDetails order={order} />
      {order.status != OrderStatus.Complete && (
        <>
          <Timer expiresAt={order.expiresAt} />
          <Payment
            orderId={order.id}
            session={session}
            expiresAt={order.expiresAt}
          />
        </>
      )}
    </div>
  );
}
