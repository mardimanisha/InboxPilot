import { features } from "@/data/features";
import FeatureCard from "@/components/common/FeatureCard";
import SectionTitle from "../common/SectionTitle";


export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <SectionTitle
          title="Everything you need to master your inbox"
          subtitle="Powerful AI features designed to transform email chaos into productivity"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}