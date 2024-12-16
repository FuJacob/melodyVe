"use client";
import React from "react";
import Submit from "./Submit";
import { Typewriter } from "react-simple-typewriter";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import Guide from "./Guide";
import Features from "./Features";
const Hero = () => {
  return (
    <>
      <div
        className="hero min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "50% 100%"
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 2,
            ease: "easeIn"

          }}
        >
          <img src="melodyve.svg" className="w-[34rem]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1,
            duration: 2,
            ease: "easeIn"

          }}
          className="bg-accent text-white rounded-3xl shadow-xl py-4 w-2/5 text-center font-semibold text-xl mt-12"

        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.5,
            duration: 2,
            ease: "easeIn"
          }}
        >          <Link href="/input">
            <button className="btn btn-secondary text-white text-xl rounded-2xl mt-16 shadow-xl">
              get started
            </button>
          </Link>
        </motion.div>
      </div>
      <Guide />
      <Features />
    </>
  );
};

export default Hero;
