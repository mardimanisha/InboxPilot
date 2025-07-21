"use client"

import { Mail } from "lucide-react"
import { footerLinks, footerInfo } from "@/data/footer"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                {footerInfo.brandName}
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">{footerInfo.description}</p>
          </div>

          {/* Footer Navigation */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3 text-gray-600">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-gray-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-500">
          <p>{footerInfo.copyright}</p>
        </div>
      </div>
    </footer>
  )
}