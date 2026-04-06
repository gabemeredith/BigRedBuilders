import { AboutHero } from "@/components/about/AboutHero";
import { HowItWorks } from "@/components/about/HowItWorks";
import { EloExplainer } from "@/components/about/EloExplainer";
import { FAQ } from "@/components/about/FAQ";
import { Disclaimer } from "@/components/about/Disclaimer";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-20">
        <AboutHero />
        <HowItWorks />
        <EloExplainer />
        <FAQ />
        <Disclaimer />
      </div>
    </div>
  );
}
