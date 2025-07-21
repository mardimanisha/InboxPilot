"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Logo from "../common/Logo"

export default function SignIn() {
    const { signIn } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            await signIn()
        } catch (error) {
            console.error('Sign in error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Logo />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Connect your Gmail to get started</p>
                </div>

                <Card className="border-0 shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle>Sign in with Google</CardTitle>
                        <CardDescription>Securely connect your Gmail account to start managing your emails with AI</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                            size="lg"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Connecting...
                                </div>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-5 w-5" />
                                    Continue with Google
                                </>
                            )}
                        </Button>

                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start space-x-3">
                                <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Secure & Private</p>
                                    <p>
                                        We only request the minimum permissions needed and never store your full email content without
                                        permission.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Quick Setup</p>
                                    <p>Get started in under 2 minutes. No complex configuration required.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 text-center">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </a>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Need help?{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}