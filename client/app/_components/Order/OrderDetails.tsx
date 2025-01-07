import { OrderAttr } from "@/app/_lib/data-service";
import { cookies } from "next/headers";

export default function OrderDetails({ order }: { order: OrderAttr }) {
  const { id, ticket, userId, status, expiresAt, version } = order;

  return (
    <div className="flex border-primary-800 border">
      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-primary-950">
          <h3 className="text-accent-500 font-semibold text-2xl mb-3">
            Order ID {id}
          </h3>

          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              Order Status: <span className="font-bold">{status}</span>
            </p>
          </div>
          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              Ticket Title: <span className="font-bold">{ticket.title}</span>
            </p>
          </div>
          <div className="flex gap-3 items-center mb-2">
            <p className="text-lg text-primary-200">
              Ticker Id: <span className="font-bold">{ticket.id}</span>
            </p>
          </div>

          <p className="flex gap-3 justify-end items-baseline">
            <span className="text-3xl font-[350]">${ticket.price}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
