// middle.js
import { NextResponse, NextRequest } from "next/server";

import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // name need to be middleware
  console.log(request);

  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  try {
    const res = await fetch(
      "http://auth-srv.default.svc.cluster.local:3000/api/users/currentuser",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionCookie}`,
        },
      }
    );
    const resJson = await res.json();
    const isAuthenticated = !!resJson?.currentUser;

    if (isAuthenticated) return NextResponse.next();
  } catch (error) {
    console.error(error);
  }
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

export const config = {
  matcher: ["/auth/testpage"], //this middle only run at route inside matcher array
};
