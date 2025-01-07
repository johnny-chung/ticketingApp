import { OrderAttr } from "@/app/_lib/data-service";
import Link from "next/link";

export default function OrderCard({ order }: { order: OrderAttr }) {
  return (
    <div className="flex border-primary-800 border">
      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-primary-950">
          <h3 className="text-accent-500 font-semibold text-2xl mb-3">
            Order ID: {order.id}
          </h3>

          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              <span className="font-bold">{order.ticket.title}</span>
            </p>
          </div>

          <p className="flex gap-3 justify-end items-baseline">
            <span className="text-3xl font-[350]">${order.ticket.price}</span>
          </p>
          <p className="flex gap-3 justify-end items-baseline">
            <span className="text-3xl font-[350]">{order.status}</span>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 text-right">
          <Link
            href={`/order/${order.id}`}
            className="border-l border-primary-800 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-900"
          >
            View Order
          </Link>
        </div>
      </div>
    </div>
  );
}
