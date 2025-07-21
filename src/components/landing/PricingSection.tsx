import { pricing } from "@/data/pricing"
import PricingCard from "@/components/common/PricingCard"
import SectionTitle from "@/components/common/SectionTitle"

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          title="Simple, transparent pricing"
          subtitle="Choose the plan that fits your needs"
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricing.map((plan, i) => (
            <PricingCard key={i} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}