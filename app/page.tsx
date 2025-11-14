import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingCTA, LandingFooter } from "@/components/landing/LandingCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-100">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
