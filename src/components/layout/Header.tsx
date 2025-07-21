"use client"

import Link from "next/link"
import { Button } from "../common/Button"
import Logo from "../common/Logo"


export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Logo />

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