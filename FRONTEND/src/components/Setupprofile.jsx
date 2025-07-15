"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useApp } from "../context/AppContext"
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
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2.5 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                   placeholder-gray-400 shadow-sm hover:shadow-md ${className}`}
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
    </div>
  </div>
)

const TextAreaField = ({ icon: Icon, label, name, value, onChange, placeholder, required = false, rows = 3 }) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <Icon className="w-4 h-4 text-indigo-600" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2.5 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                   placeholder-gray-400 shadow-sm hover:shadow-md resize-none"
      />
      <Icon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
    </div>
  </div>
)

const SelectField = ({ icon: Icon, label, name, value, onChange, options, required = false }) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <Icon className="w-4 h-4 text-indigo-600" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2.5 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                   shadow-sm hover:shadow-md appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
)

const FileUploadField = ({ icon: Icon, label, onChange, accept = "image/*", value, sectionColor = "indigo" }) => (
  <div className="group relative">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <Icon
        className={`w-4 h-4 ${sectionColor === "blue" ? "text-blue-600" : sectionColor === "pink" ? "text-pink-600" : "text-indigo-600"}`}
      />
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className="w-full px-3 py-2.5 pl-10 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg
                    focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent
                     transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer
                    flex items-center justify-between group-hover:border-indigo-300"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon
            className={`w-4 h-4 text-gray-400 group-focus-within:${sectionColor === "blue" ? "text-blue-600" : sectionColor === "pink" ? "text-pink-600" : "text-indigo-600"} transition-colors flex-shrink-0`}
          />
          <span className={`text-sm truncate ${value ? "text-gray-900 font-medium" : "text-gray-400"}`}>
            {value ? value.name : "Choose image file..."}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {value && <CheckCircle className="w-4 h-4 text-green-500" />}
          <span
            className={`px-3 py-1 text-white text-xs font-medium rounded-lg ${
              sectionColor === "blue"
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : sectionColor === "pink"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
          >
            Browse
          </span>
        </div>
      </div>
    </div>
  </div>
)

const Setupprofile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email
  const { globalusername, setglobalusername } = useApp()

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
  const [socialDpFile, setSocialDpFile] = useState(null)
  const [professionalDpFile, setProfessionalDpFile] = useState(null)

  useEffect(() => {
    if (!email) {
      alert("Email verification is not done. Redirecting to landing page...")
      navigate("/", { replace: true })
    }
  }, [])

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
      alert("Error checking username:")
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
      const formDataToSend = new FormData()
      formDataToSend.append("username", formData.username)
      formDataToSend.append("email", email)
      formDataToSend.append("password", formData.password)
      formDataToSend.append(
        "socialProfile",
        JSON.stringify({
          name: formData.socialName,
          bio: formData.socialBio,
          hobbies: formData.hobbies,
        }),
      )
      formDataToSend.append(
        "professionalProfile",
        JSON.stringify({
          name: formData.professionalName,
          bio: formData.professionalBio,
          occupation: formData.occupation,
        }),
      )

      if (socialDpFile) {
        formDataToSend.append("socialDp", socialDpFile)
      }
      if (professionalDpFile) {
        formDataToSend.append("professionalDp", professionalDpFile)
      }

      const response = await axios.post(`${APIURL}/signup/saveprofiledata`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        const { jwtToken, username } = response.data
        localStorage.setItem("jwtToken", jwtToken)
        localStorage.setItem("username", username)
        // Save to global context/state
        setglobalusername(username)
        setShowSuccessToast(true)
      } else {
        alert("Failed to create user")
      }
    } catch (error) {
      alert("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (showSuccessToast) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [showSuccessToast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-white to-purple-500 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-800 font-semibold text-sm">Welcome to TweniQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 text-base px-4">Tell us about yourself to get started</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <h2 className="text-xl font-bold text-white">Account Setup</h2>
            <p className="text-indigo-100 mt-1 text-sm">Create your unique profile</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Account Credentials Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Account Credentials</h3>
              </div>

              {/* Username with real-time validation */}
              <div className="group relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Username
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={checkusernameavailable}
                    minLength={1}
                    placeholder="Choose a unique username"
                    className="w-full px-3 py-2.5 pl-10 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                             placeholder-gray-400 shadow-sm hover:shadow-md"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  {formData.username && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {usernameStatus === "available" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    Password
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a secure password"
                      className="w-full px-3 py-2.5 pl-10 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                               placeholder-gray-400 shadow-sm hover:shadow-md"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="group relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    Confirm Password
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2.5 pl-10 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                               placeholder-gray-400 shadow-sm hover:shadow-md"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm font-medium">{passwordError}</span>
                </div>
              )}
            </div>

            {/* Professional Profile Section */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Professional Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    { value: "Developer", label: "Developer" },
                    { value: "Designer", label: "Designer" },
                    { value: "Marketer", label: "Marketer" },
                    { value: "Student", label: "Student" },
                    { value: "Teacher", label: "Teacher" },
                    { value: "Freelancer", label: "Freelancer" },
                    { value: "Business Owner", label: "Business Owner" },
                    { value: "Other", label: "Other" },
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
                rows={3}
              />

              <FileUploadField
                icon={User}
                label="Upload Professional DP"
                onChange={(e) => setProfessionalDpFile(e.target.files[0])}
                accept="image/*"
                value={professionalDpFile}
                sectionColor="blue"
              />
            </div>

            {/* Social Profile Section */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Social Profile</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    { value: "Reading", label: "Reading" },
                    { value: "Traveling", label: "Traveling" },
                    { value: "Gaming", label: "Gaming" },
                    { value: "Sports", label: "Sports" },
                    { value: "Music", label: "Music" },
                    { value: "Art", label: "Art" },
                    { value: "Coding", label: "Coding" },
                    { value: "Other", label: "Other" },
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
                rows={3}
              />

              <FileUploadField
                icon={Heart}
                label="Upload Social DP"
                onChange={(e) => setSocialDpFile(e.target.files[0])}
                accept="image/*"
                value={socialDpFile}
                sectionColor="pink"
              />
            </div>

            {/* Required Fields Note */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 flex items-center gap-1 justify-center">
                <span className="text-red-500">*</span>
                <span>are required fields</span>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || usernameStatus !== "available"}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                          disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                         text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                         flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create My Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray bg-opacity-20 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to TweniQ! 🎉</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Your profile has been created successfully. Get ready to connect and grow!
              </p>
              <button
                onClick={() => {
                  setShowSuccessToast(false)
                  navigate("/pages")
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                          text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
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
