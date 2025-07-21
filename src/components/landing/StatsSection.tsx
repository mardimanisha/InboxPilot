import React from "react";

const StatsSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-gray-900 mb-2">2.5hrs</div>
          <div className="text-gray-600">Daily time saved</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-gray-900 mb-2">94%</div>
          <div className="text-gray-600">Classification accuracy</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-gray-900 mb-2">10k+</div>
          <div className="text-gray-600">Happy professionals</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-gray-900 mb-2">50%</div>
          <div className="text-gray-600">Faster email responses</div>
        </div>
      </div>
    </div>
  </section>
);

export default StatsSection;