"use client";
import Link from "next/link";
import SignoutBtn from "./SignoutBtn";

export default function AuthenticatedNavBar() {
  return (
    <div className="w-full z-10 mx-6 my-10 text-base sm:max-w-5xl my-16 text-xl">
      <ul className="flex gap-10 items-center sm: gap-16">
        <>
          <li>
            <SignoutBtn />
          </li>
          <li>
            <Link href="/tickets/new" className="hover:text-accent-400">
              New Ticket
            </Link>
          </li>
          <li>
            <Link href="/tickets" className="hover:text-accent-400">
              Ticket List
            </Link>
          </li>
          <li>
            <Link href="/order" className="hover:text-accent-400">
              Order List
            </Link>
          </li>
        </>
      </ul>
    </div>
  );
}
