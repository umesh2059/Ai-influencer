import Header from "../components/Header";
import Hero from "../components/Hero";
import InteractiveInfluencerGenerator from "../components/InteractiveInfluencerGenerator";
import PostSchedulerSimulator from "../components/PostSchedulerSimulator";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <InteractiveInfluencerGenerator />
        <PostSchedulerSimulator />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

