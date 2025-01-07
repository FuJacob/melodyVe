"use client";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();
  return session ? (
    <button
      onClick={() => signOut()}
      className="btn btn-sm btn-secondary text-white"
    >
      sign out
    </button>
  ) : (
    <button
      onClick={() => signIn()}
      className="btn btn-sm btn-secondary text-white"
    >
      sign in
    </button>
  );
}
const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="navbar gap-2 border bg-base-100">
      <div className="flex-1">
        <Link href="/">
          <img
            src="melodyve.svg"
            className="w-24 ml-5"
          />
        </Link>
      </div>
      <Link href="/">
        <button className="btn btn-ghost">home</button>
      </Link>
      <Link href="/input">
        <button className="btn btn-sm btn-secondary text-white">try now</button>
      </Link>
      <div className="border-l-2 h-8 mx-4" />
      {session ? (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button">
            <div className="flex flex-inline items-center">
              <img
                src={session?.user.image || "user.png"}
                className="w-12 border border-2 border-secondary rounded-full"
              />
              <h1 className=" px-4 font-bold">Profile</h1>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-3xl z-[1] w-44 p-4 space-y-6 shadow max-h-[60rem] overflow-y-auto"
          >
            <div className="flex flex-col items-center space-y-2">
              <img
                src={session?.user.image || "user.png"}
                className="flex justify-center w-24 border-secondary rounded-full"
              />
              <h1 className="font-semibold text-xl">{session.user.name}</h1>{" "}
              <a
                href="/profile"
                className="btn font-semibold btn-sm text-white bg-secondary"
              >
                View profile
              </a>
              <AuthButton />
            </div>
          </ul>
        </div>
      ) : (
        <AuthButton />
      )}
    </nav>
  );
};

export default Navbar;
