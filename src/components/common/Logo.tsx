import { Mail } from "lucide-react";

export default function Logo() {
    return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">InboxPilot</span>
        </div>
    )
}