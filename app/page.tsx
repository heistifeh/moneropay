import Image from "next/image";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Elementor from "./components/elementor";
import Media from "./components/Media";
import How from "./components/How";
import FAQ from "./components/FAQ";
import Facts from "./components/facts";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Facts />
      <Media />
      <How />
      <FAQ />
    </>
  );
}
