"use client";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="w-full z-10 mx-6 my-10 text-base sm:max-w-5xl my-16 text-xl">
      <ul className="flex gap-10 items-center sm: gap-16">
        <>
          <li>
            <Link href="/auth/signup" className="hover:text-accent-400">
              Sign Up
            </Link>
          </li>
          <li>
            <Link href="/auth/signin" className="hover:text-accent-400">
              Sign In
            </Link>
          </li>
         
        </>
      </ul>
    </div>
  );
}
