"use client"
import Image from "next/image";
import Hero from "./components/Hero";
import Guide from "./components/Guide";
import Features from "./components/Features";

export default function Home() {
  return (
    <>
      <Hero />
      <Guide />
      <Features />
    </>
  );
}
