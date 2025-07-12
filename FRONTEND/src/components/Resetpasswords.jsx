"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Tweniq from "./Tweniq";

const ResetPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const APIURL = import.meta.env.VITE_API_BASE_URL

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const response = await axios.post(`${APIURL}/resetpassword/sendotp`, {
        email: formData.email,
      })

      if (response.status === 200) {
        toast.success("OTP sent to your email!")
        setStep(2)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post(`${APIURL}/resetpassword/verifyotp`, {
        email: formData.email,
        otp: formData.otp,
      })

      if (response.status === 200) {
        toast.success("OTP verified successfully!")
        setStep(3)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (formData.password.length < 3) {
      setError("Password should be at least 3 characters long.")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${APIURL}/resetpassword/setnewpassword`, {
        email: formData.email,
        newpassword: formData.password,
      })

      if (response.status === 200) {
        toast.success("Password reset successfully!")
        setTimeout(() => {
          navigate("/signin")
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStepInfo = () => {
    const stepInfo = {
      1: { title: "Reset Password", desc: "Enter your email to receive OTP" },
      2: { title: "Verify OTP", desc: "Enter the code sent to your email" },
      3: { title: "New Password", desc: "Create your new password" },
    }
    return stepInfo[step]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-indigo-400 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <div className="w-2 h-2 bg-white rounded-full"></div>
        <Tweniq />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{getStepInfo().title}</h1>
          <p className="text-indigo-100">{getStepInfo().desc}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Step {step} of 3</h2>
            <div className="flex mt-2 space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-white" : "bg-indigo-400"}`} />
              ))}
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-lg font-mono tracking-widest"
                    placeholder="000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sent to: {formData.email}</p>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
onClick={() => {
  setStep(1);
  setFormData((prev) => ({ ...prev, otp: "" }));
}}                  className="w-full text-indigo-600 py-2 text-sm font-medium hover:text-indigo-800 transition-colors"
                >
                  Change Email
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/signin")}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors hover:cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
