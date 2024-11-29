"use client";
import React from "react";
import Submit from "./Submit";
import { Typewriter } from "react-simple-typewriter";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div
        className="hero min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('bg.svg')",
        }}
      >
        <h1 className="text-3xl font-bold">introducing</h1>
        <img src="melodyve.svg" className="w-96" />
        <div className="bg-accent text-white rounded-3xl shadow-xl py-4 w-2/5 text-center font-semibold text-xl mt-12">
          <Typewriter
            words={[
              "discover the harmony in your favorite songs",
              "find the melody that brings you closer",
              "let the music reveal how connected you truly are",
              "feel the rhythm of your compatibility",
              "let your music bring your connection to light",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={5000}
          />
        </div>
        <Link href="/input">
          <button className="btn btn-secondary text-white text-xl rounded-2xl mt-16 shadow-xl">
            get started
          </button>
        </Link>
      </div>
    </>
  );
};

export default Hero;
