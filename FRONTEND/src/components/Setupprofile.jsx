"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../context/AppContext"; 


import { User, Lock, Briefcase, Heart, FileText, CheckCircle, XCircle, Eye, EyeOff, Sparkles } from "lucide-react"

const APIURL = import.meta.env.VITE_API_BASE_URL

// Move component definitions outside to prevent re-creation on each render
const InputField = ({
  icon: Icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <Icon className="w-4 h-4 text-indigo-600" />
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 pl-12 text-gray-900 bg-white border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                   placeholder-gray-400 shadow-sm hover:shadow-md ${className}`}
      />
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
    </div>
  </div>
)

const TextAreaField = ({ icon: Icon, label, name, value, onChange, placeholder, required = false, rows = 3 }) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <Icon className="w-4 h-4 text-indigo-600" />
      {label}
    </label>
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 pl-12 text-gray-900 bg-white border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                   placeholder-gray-400 shadow-sm hover:shadow-md resize-none"
      />
      <Icon className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
    </div>
  </div>
)

const SelectField = ({ icon: Icon, label, name, value, onChange, options, required = false }) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <Icon className="w-4 h-4 text-indigo-600" />
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 pl-12 text-gray-900 bg-white border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                   shadow-sm hover:shadow-md appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
)

const Setupprofile = () => {
  const location = useLocation()
    const navigate = useNavigate();
  
  const email = location.state?.email
  const { globalusername, setglobalusername } = useApp();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    professionalName: "",
    socialName: "",
    professionalBio: "",
    socialBio: "",
    occupation: "",
    hobbies: "",
  })

  const [usernameStatus, setUsernameStatus] = useState("taken")
  const [passwordError, setPasswordError] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkusernameavailable = async (e) => {
    const usernameatinstant = e.target.value
    handleInputChange(e)

    if (!usernameatinstant) {
      setUsernameStatus(null)
      return
    }

    try {
      const response = await fetch(
        `${APIURL}/signup/usernameavailability?username=${encodeURIComponent(usernameatinstant)}`,
        { method: "GET" },
      )

      const data = await response.json()

      if (response.ok) {
        setUsernameStatus(data.available ? "available" : "taken")
      }
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameStatus(null)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "password" || name === "confirmPassword") {
      validatePasswords(name, value)
    }
  }

  const validatePasswords = (updatedField, updatedValue) => {
    const passwordone = updatedField === "password" ? updatedValue : formData.password
    const passwordsecond = updatedField === "confirmPassword" ? updatedValue : formData.confirmPassword

    if (passwordone !== passwordsecond) {
      setPasswordError("Passwords do not match")
    } else if (passwordone.length < 3 || passwordsecond.length < 3) {
      setPasswordError("Passwords should be at least 3 characters long")
    } else {
      setPasswordError("")
    }
  }

 
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (usernameStatus !== "available") {
      alert("This username is not available")
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        username: formData.username,
        email,
        password: formData.password,
        socialProfile: {
          name: formData.socialName,
          bio: formData.socialBio,
          hobbies: formData.hobbies,
        },
        professionalProfile: {
          name: formData.professionalName,
          bio: formData.professionalBio,
          occupation: formData.occupation,
        },
      }

      const response = await axios.post(`${APIURL}/signup/saveprofiledata`, userData, {
        headers: { "Content-Type": "application/json" },
      })

      if (response.status === 200) {
              const { jwtToken, username } = response.data;

         localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("username", username);

      // Save to global context/state
      setglobalusername(username);
        setShowSuccessToast(true)
      } else {
        alert("Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      alert("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }
useEffect(() => {
  if (showSuccessToast) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = ""; 
  }

  return () => {
    document.body.style.overflow = ""; 
  };
}, [showSuccessToast]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-white to-purple-500 py-8 px-4">
      <div className="scale-80 transform -m-30">
        <div className="max-w-4xl mx-auto ">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-800 font-semibold">Welcome to SocioFusion</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600 text-lg">Tell us about yourself to get started</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Account Setup</h2>
              <p className="text-indigo-100 mt-1">Create your unique profile</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Account Credentials Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Account Credentials</h3>
                </div>

                {/* Username with real-time validation */}
                <div className="group relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={checkusernameavailable}
                      minLength={1}
                      placeholder="Choose a unique username"
                      className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 rounded-xl 
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                               placeholder-gray-400 shadow-sm hover:shadow-md"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    {formData.username && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {usernameStatus === "available" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.username && (
                    <div
                      className={`mt-2 text-sm font-medium flex items-center gap-2 ${
                        usernameStatus === "available" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {usernameStatus === "available" ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Username is available
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Username is already taken
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a secure password"
                        className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 rounded-xl 
                                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                                 placeholder-gray-400 shadow-sm hover:shadow-md"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 rounded-xl 
                                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                                 placeholder-gray-400 shadow-sm hover:shadow-md"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700 text-sm font-medium">{passwordError}</span>
                  </div>
                )}
              </div>

              {/* Professional Profile Section */}
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Professional Profile</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    icon={User}
                    label="Professional Name"
                    name="professionalName"
                    value={formData.professionalName}
                    onChange={handleInputChange}
                    placeholder="Your professional display name"
                    required
                  />

                  <SelectField
                    icon={Briefcase}
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: "", label: "Select your occupation" },
                      { value: "developer", label: "Developer" },
                      { value: "designer", label: "Designer" },
                      { value: "marketer", label: "Marketer" },
                      { value: "student", label: "Student" },
                      { value: "teacher", label: "Teacher" },
                      { value: "freelancer", label: "Freelancer" },
                      { value: "business_owner", label: "Business Owner" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>

                <TextAreaField
                  icon={FileText}
                  label="Professional Bio"
                  name="professionalBio"
                  value={formData.professionalBio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your professional background and expertise..."
                  required
                  rows={4}
                />
              </div>

              {/* Social Profile Section */}
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Social Profile</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    icon={User}
                    label="Social Name"
                    name="socialName"
                    value={formData.socialName}
                    onChange={handleInputChange}
                    placeholder="Your friendly display name"
                    required
                  />

                  <SelectField
                    icon={Heart}
                    label="Hobbies & Interests"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: "", label: "Select your main interest" },
                      { value: "reading", label: "Reading" },
                      { value: "traveling", label: "Traveling" },
                      { value: "gaming", label: "Gaming" },
                      { value: "sports", label: "Sports" },
                      { value: "music", label: "Music" },
                      { value: "art", label: "Art" },
                      { value: "coding", label: "Coding" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>

                <TextAreaField
                  icon={FileText}
                  label="Social Bio"
                  name="socialBio"
                  value={formData.socialBio}
                  onChange={handleInputChange}
                  placeholder="Share something fun about yourself and your interests..."
                  required
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting || usernameStatus !== "available"}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                           disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                           text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 
                           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                           flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create My Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray bg-opacity-20 backdrop-blur-sm">
    <div
      className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center mb-12"
      style={{ marginBottom: "250px" }}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SocioFusion! 🎉</h2>
      <p className="text-gray-600 mb-6">
        Your profile has been created successfully. Get ready to connect and grow!
      </p>
      <button
        onClick={() => {
          setShowSuccessToast(false);
          navigate("/pages");
        }}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                   text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 
                   shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Continue to Home
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default Setupprofile
