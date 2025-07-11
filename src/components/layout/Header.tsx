"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "../common/Button"


export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">InboxPilot</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">How it works</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Link href="/auth/signin">
          <Button className="bg-gray-900 hover:scale-x-110 transition-transform duration-200 text-white rounded-full px-6 cursor-pointer">Sign up →</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
