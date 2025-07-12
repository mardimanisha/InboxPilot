import HeroSection from "@/pages/landing/HeroSection";
import Header from "@/components/layout/Header";
import StatsSection from "@/pages/landing/StatsSection";
import FeaturesSection from "@/pages/landing/FeaturesSection";
import HowItWorksSection from "@/pages/landing/HowItWorksSection";
import PricingSection from "@/pages/landing/PricingSection";
import CTASection from "@/components/layout/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
