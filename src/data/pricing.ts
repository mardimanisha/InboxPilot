export interface PricingPlan {
    title: string;
    price: number;
    description: string;
    features: string[];
    isPopular?: boolean;
  }
  
  export const pricing: PricingPlan[] = [
    {
      title: "Starter",
      price: 9,
      description: "Perfect for individuals",
      features: [
        "Up to 1,000 emails/month",
        "AI email classification",
        "Smart reply suggestions",
        "Daily priority digest",
      ],
    },
    {
      title: "Professional",
      price: 29,
      description: "For power users and teams",
      isPopular: true,
      features: [
        "Unlimited emails",
        "Advanced AI features",
        "Task management",
        "Notion & Zapier integration",
        "Priority support",
      ],
    },
  ];