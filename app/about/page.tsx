import Facts from "../components/facts";
import FAQ from "../components/FAQ";
import AboutHero from "./components/aboutHero";
import FinalCTA from "./components/FinalCTA";
import MissionValues from "./components/missionValues";
import PressStrip from "./components/pressStrip";
import Stats from "./components/stats";
import Timeline from "./components/timeline";

export default function About() {
  return (
    <div className="bg-white">
      <AboutHero />
      <MissionValues />
      <Stats />
      <Timeline />
      {/* <TeamPreview /> */}
      <PressStrip />
      <Facts />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
