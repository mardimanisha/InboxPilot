import SectionTitle from "@/components/common/SectionTitle"
import { steps } from "@/data/howItWorks"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionTitle
          title="Get started in minutes"
          subtitle="Three simple steps to transform your email experience"
        />

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map(({ step, title, description, gradient }) => (
            <div key={step} className="text-center">
              <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <span className="text-2xl font-bold text-white">{step}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}