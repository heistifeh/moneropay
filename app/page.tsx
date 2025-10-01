
import Hero from "./components/Hero";
import Features from "./components/Features";
import Media from "./components/Media";
import How from "./components/How";
import FAQ from "./components/FAQ";
import Facts from "./components/facts";
import PriceBoard from "./components/PriceBoard";

export default function Home() {
  return (
    <>
      <Hero />
      <PriceBoard />
      <Features />
      <Facts />
      <Media />
      <How />
      <FAQ />
    </>
  );
}
