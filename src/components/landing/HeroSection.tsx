"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '../common/Button'

export default function HeroSection() {
    return (
        <section>
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

            <div className="relative container mx-auto px-6 py-20 text-center max-w-7xl">
                {/* Headline */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                        Conquer your email
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            without hiring
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
                        The first AI email assistant that you&apos;ll love.
                    </p>

                    <p className="text-lg text-gray-500 mb-12">
                        And a team of experts to get you started.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Link href="/auth/signin" className="flex">
                            <Button 
                                size="lg"
                                className="flex items-center bg-gray-900 hover:scale-105 transition-transform duration-200 text-white px-8 py-4 text-lg rounded-full"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        
                        <Button variant="ghost" size="lg" className="flex items-center cursor-pointer px-8 py-4 text-lg text-gray-600 hover:text-gray-900">
                            <Play className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}