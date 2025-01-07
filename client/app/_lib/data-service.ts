import { notFound } from "next/navigation";

export enum OrderStatus {
  Created = "created",
  Cancelled = "cancelled",
  AwaitingPayment = "awaiting:payment",
  Complete = "complete",
}

export interface TicketAttr {
  id: string;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
}

export interface OrderAttr {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketAttr;
  version: number;
}

export async function getTicket(
  ticketId: string,
  sessionCookie: string | undefined
): Promise<TicketAttr> {
  console.log("making get request ", `/api/ticket/${ticketId}`);
  try {
    const res = await fetch(
      `http://ticket-srv.default.svc.cluster.local:3000/api/ticket/${ticketId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionCookie && { Cookie: `session=${sessionCookie}` }),
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Fail to retrieve ticket");
    }

    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
export async function getTicketList(
  sessionCookie: string | undefined
): Promise<TicketAttr[]> {
  console.log("making get request ", `/api/ticket`);

  try {
    const res = await fetch(
      `http://ticket-srv.default.svc.cluster.local:3000/api/ticket`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionCookie && { Cookie: `session=${sessionCookie}` }),
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Fail to retrieve ticket list");
    }

    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function getOrder(
  orderId: string,
  sessionCookie: string | undefined
): Promise<OrderAttr> {
  try {
    const res = await fetch(
      `http://order-srv.default.svc.cluster.local:3000/api/order/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionCookie && { Cookie: `session=${sessionCookie}` }),
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Fail to retrieve Order");
    }

    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function getOrderList(
  sessionCookie: string | undefined
): Promise<OrderAttr[]> {
  try {
    const res = await fetch(
      `http://order-srv.default.svc.cluster.local:3000/api/order/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionCookie && { Cookie: `session=${sessionCookie}` }),
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Fail to retrieve order list");
    }

    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
