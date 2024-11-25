import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Guide from "./components/Guide"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
<div className="min-h-screen bg-base-200">
        <Guide />
  
</div>
      <Footer />

      </>
  );
}
