import { Mail } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <div className={twMerge("flex items-center space-x-2", className)}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">InboxPilot</span>
        </div>
    )
}