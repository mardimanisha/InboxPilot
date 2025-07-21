"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function CTASection() {
  return (
    <section className="py-24 bg-gray-900">
        <div className="container mx-auto text-center max-w-4xl px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to transform your inbox?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of professionals who have already taken control of their email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-full hover:transform hover:scale-x-105 transition-transform duration-200">
                Get Started with Google
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-gray-400 mt-6">14-day free trial • No credit card required</p>
        </div>
      </section>
  )
}