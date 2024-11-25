"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-base-200 gap-2">
      <div className="flex-1">
        <Link href="/">
          <img src="melodyve.svg" className="w-24 ml-5" />
        </Link>
      </div>
      <Link href="/">
        <button className="btn btn-secondary text-white">
          home
        </button>
      </Link>
      <button className="btn btn-secondary text-white">about</button>
    </div>
  );
};

export default Navbar;
