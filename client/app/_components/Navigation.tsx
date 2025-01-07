import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import NavBar from "./NavBar";
import AuthenticatedNavBar from "./AuthenticatedNavBar";

export default async function Navigation() {
  noStore();
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  let isAuthenticated = false;
  try {
    // need to call auth srv nod from client nod
    // opt 1
    // use cluster ip
    //const res = await fetch("http://auth-srv.default.svc.cluster.local:3000/api/users/currentuser", {
    // opt 2
    // Reach out to ingress nginx cross namespace
    const res = await fetch(
      "http://auth-srv.default.svc.cluster.local:3000/api/users/currentuser",
      // below don't really work
      //"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionCookie}`,
        },
      }
    );
    if (!res.ok) throw new Error("fail to get current user");
    const resJson = await res.json();
    console.log(resJson);
    isAuthenticated = !!resJson?.currentUser;
    console.log("isAuthenticated: ", isAuthenticated);
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return <>{isAuthenticated ? <AuthenticatedNavBar /> : <NavBar />}</>;
}
