"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Clock, Users, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [otpSent, countdown])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Clear errors when switching tabs
    setLoginError("")
    setRegisterError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }

    setLoginError("")
    setIsLoginLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to home page or dashboard
        router.push("/")
        router.refresh()
      } else {
        setLoginError(data.message || "Login failed")
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again.")
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!registerEmail) {
      setRegisterError("Please enter your email first")
      return
    }
    
    setIsRegisterLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmail })
      })
      const data = await res.json()
      
      if (res.ok) {
        setOtpSent(true)
        setCountdown(180) // 3 minutes countdown
        setRegisterError("")
      } else {
        setRegisterError(data.message || "Failed to send OTP")
      }
    } catch (err) {
      setRegisterError("Failed to send OTP")
    } finally {
      setIsRegisterLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setRegisterError("Please enter the OTP")
      return
    }

    setIsRegisterLoading(true)
    try {
      const otpRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: registerEmail,
          otp: otp 
        })
      })
      const otpData = await otpRes.json()

      if (otpData.verified) {
        setOtpVerified(true)
        setRegisterError("")
      } else {
        setRegisterError("Invalid OTP")
      }
    } catch (err) {
      setRegisterError("Failed to verify OTP")
    } finally {
      setIsRegisterLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError("Please fill in all fields")
      return
    }

    if (!otpVerified) {
      setRegisterError("Please verify your email with OTP first")
      return
    }

    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match")
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters")
      return
    }

    if (!agreeTerms) {
      setRegisterError("You must agree to the Terms of Service and Privacy Policy")
      return
    }

    setRegisterError("")
    setIsRegisterLoading(true)

    try {
      // Proceed with registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to home page or dashboard
        router.push("/")
        router.refresh()
      } else {
        setRegisterError(data.message || "Registration failed")
      }
    } catch (error) {
      setRegisterError("An error occurred. Please try again.")
    } finally {
      setIsRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-200 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-amber-200 rounded-lg overflow-hidden">
          <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="login"
                className={`py-3 ${
                  activeTab === "login" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={`py-3 ${
                  activeTab === "signup" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Login Form */}
              <TabsContent value="login" className="w-full md:w-1/2">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-amber-900 mb-2">Login to TastyBites</h2>
                  <p className="text-amber-700 mb-6">Enter your credentials to access your account</p>

                  {loginError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label htmlFor="login-email" className="block text-amber-900 mb-2">
                        Email
                      </label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-amber-900 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Eye className="h-5 w-5 text-amber-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Checkbox id="remember-me" className="border-amber-400 text-amber-500" />
                      <label htmlFor="remember-me" className="ml-2 text-amber-800">
                        Remember me
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "Logging in..." : "Login"}
                    </Button>

                    <div className="text-center">
                      <Link href="/auth/forgot-password" className="text-amber-600 hover:text-amber-700">
                        Forgot your password?
                      </Link>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup" className="w-full md:w-1/2">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-brown-600">Create an Account</h2>
                  <p className="mt-2 text-orange-600">Join TastyBites and start sharing your recipes</p>

                  {registerError && (
                    <div className="text-red-500 text-sm mt-4">
                      {registerError}
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-brown-600 mb-1">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-brown-600 mb-1">
                        Email
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                          required
                          disabled={otpSent && otpVerified}
                        />
                        <Button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={isRegisterLoading || (otpSent && countdown > 0) || !registerEmail || otpVerified}
                          className="px-4 py-2 bg-orange-300 text-brown-600 rounded hover:bg-orange-400 transition-colors"
                        >
                          Send OTP
                        </Button>
                      </div>
                    </div>

                    {!otpVerified && (
  <div>
    <label className="block text-brown-600 mb-1">Enter OTP</label>
    <div className="flex gap-2">
      <Input
        type="text"
        value={otp}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '')
          if (value.length <= 6) setOtp(value)
        }}
        maxLength={6}
        placeholder={otpSent ? "Enter 6-digit OTP" : "Send OTP first"}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
        required
        disabled={!otpSent} // Disable input until OTP is sent
      />
      <Button
        type="button"
        onClick={handleVerifyOTP}
        disabled={isRegisterLoading || otp.length !== 6 || !otpSent}
        className="px-4 py-2 bg-orange-300 text-brown-600 rounded hover:bg-orange-400 transition-colors"
      >
        Verify
      </Button>
    </div>
    {otpSent && (
      <p className="text-sm text-orange-600 mt-1">
        OTP sent to your email. Expires in {Math.floor(countdown / 60)}:
        {(countdown % 60).toString().padStart(2, '0')}
      </p>
    )}
  </div>
)}

                    <div>
                      <label className="block text-brown-600 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showRegisterPassword ? "text" : "password"}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:border-orange-500"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        >
                          {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-sm text-orange-600 mt-1">
                        Password must be at least 6 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-brown-600 mb-1">
                        Confirm Password
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="flex items-center mt-4">
                      <Checkbox
                        id="terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                        className="border-orange-300 text-orange-500"
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-brown-600">
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isRegisterLoading || !otpVerified}
                      className="w-full mt-6 bg-orange-300 text-brown-600 py-2 rounded hover:bg-orange-400 transition-colors"
                    >
                      Create Account
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* Welcome Section */}
              <div className="w-full md:w-1/2">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-amber-900 mb-4">Welcome to TastyBites</h2>
                  <p className="text-amber-800 mb-8">
                    Join our community of food lovers and discover a world of delicious recipes.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 mb-1">Save Your Favorite Recipes</h3>
                        <p className="text-amber-800">Create your personal cookbook with your favorite dishes.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 mb-1">Get Cooking Tips</h3>
                        <p className="text-amber-800">Learn professional techniques to enhance your cooking skills.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 mb-1">Join the Community</h3>
                        <p className="text-amber-800">Share your creations and connect with other food enthusiasts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
