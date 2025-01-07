import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(`Email: ${email}`);
  console.log(`Pw: ${password}`);

  try {
    const res = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    const resJson = await res.json();
    console.log(resJson);
    redirect("/auth/testpage");
  } catch (error) {
    throw error;
  }
}

export async function signin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // Perform your signup logic here
  const res = await fetch("/api/users/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Signin failed");
  }

  const resJson = await res.json();
  console.log(resJson);
  redirect("/auth/testpage");
}

export async function signout() {
  try {
    const res = await fetch("/api/users/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    redirect("/auth/signin");
  } catch (error) {
    throw error;
  }
}

export async function newTicket(formData: FormData) {
  const title = formData.get("title");
  const price = formData.get("price");
  const session = formData.get("session");

  console.log("New Ticket detail: ", title, price);

  try {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
      body: JSON.stringify({ title, price }),
    });
    console.log("post ticket: ", res);
    if (!res.ok) throw new Error("fail to create ticket");
    const resJson = await res.json();
    redirect(`https://ticketing.dev/tickets/${resJson.id}`);
  } catch (error) {
    throw error;
  }
}
export async function newOrder(ticketId: string, session: string) {
  console.log("New Order Ticket Id: ", ticketId);

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
      body: JSON.stringify({ ticketId }),
    });
    console.log("post order: ", res);
    if (!res.ok) throw new Error("fail to create order");
    const resJson = await res.json();
    redirect(`https://ticketing.dev/order/${resJson.id}`);
  } catch (error) {
    throw error;
  }
}

export async function createPaymentIntent(
  orderId: string,
  sessionCookie: string | undefined
): Promise<string> {
  try {
    const res = await fetch(`/api/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie && { Cookie: `session=${sessionCookie}` }),
      },
      body: JSON.stringify({ orderId }),
    });
    console.log(res);
    if (!res.ok) {
      throw new Error("Fail to create payment Intent");
    }

    const resJson = await res.json();
    return resJson.client_secret;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
