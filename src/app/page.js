"use client"
import Image from "next/image";
import Hero from "./components/Hero";
import Guide from "./components/Guide";
import Features from "./components/Features";
import Login from "./components/login"

export default function Home() {
  return (
    <>
    <Login />
      <Hero />
      <Guide />
      <Features />
    </>
  );
}
