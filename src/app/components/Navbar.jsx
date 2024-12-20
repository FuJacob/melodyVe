"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar fixed gap-2 border bg-base-100">
      <div className="flex-1">
        <Link href="/">
          <img src="melodyve.svg" className="w-24 ml-5" />
        </Link>
      </div>
      <Link href="/">
        <button className="btn btn-ghost">home</button>
      </Link>
      <Link href="/input">
        <button className="btn btn-sm btn-secondary text-white">try now</button>
      </Link>
    </nav>
  );
};

export default Navbar;
