import Image from "next/image";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Elementor from "./components/elementor";
import Media from "./components/Media";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Media />
    </>
  );
}
