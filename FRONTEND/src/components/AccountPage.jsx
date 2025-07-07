"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { User, Bookmark, FileText, Heart, Lock, Users, UserPlus, Mail, Calendar, LogOut } from "lucide-react"
import { useProfile } from "../context/AppContext"
import { useEffect } from "react"
import axios from "axios"
import { checkTokenValidity } from "../utils/checkToken"; // ✅ import the function


export default function AccountPage() {
  const APIURL = import.meta.env.VITE_API_BASE_URL
  const [overview, setOverview] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { profileMode } = useProfile()
  const isProfessional = profileMode === "professional"
  const navigate = useNavigate()

 useEffect(() => {
  const fetchOverview = async () => {
    // ✅ Check token validity first
    if (!checkTokenValidity()) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${APIURL}/account/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOverview(res.data);
    } catch (err) {
      console.error("Failed to fetch overview", err);
    }
  };

  fetchOverview();
}, []);

  const logout = () => {
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("username")
    navigate("/")
    setShowLogoutConfirm(false)
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  if (!overview) {
    return <div className="text-center mt-10 text-gray-500">Loading account info...</div>
  }

  const rawDpPath = isProfessional ? overview.professionalDpUrl : overview.socialDpUrl
const dpUrl = rawDpPath ? `${APIURL}${rawDpPath}` : null;

  const actionButtons = [
    {
      id: "posts",
      path: "/account/posts",
      icon: FileText,
      label: "Your Posts",
      count: profileMode === "professional" ? overview.professionalPostCount : overview.socialPostCount,
      color: profileMode === "professional" ? "blue" : "purple",
      description: "Content you've shared",
    },
    {
      id: "liked",
      path: "/account/liked",
      icon: Heart,
      label: "Liked Posts",
      count: profileMode === "professional" ? overview.professionalLikedCount : overview.socialLikedCount,
      color: profileMode === "professional" ? "red" : "pink",
      description: "Posts you've liked",
    },
    {
      id: "saved",
      path: "/account/saved",
      icon: Bookmark,
      label: "Saved Posts",
      count: profileMode === "professional" ? overview.professionalSavedCount : overview.socialSavedCount,
      color: profileMode === "professional" ? "green" : "cyan",
      description: "Posts you've bookmarked",
    },
    {
      id: "followers",
      path: "/account/followers",
      icon: Users,
      label: "Followers",
      count: overview.numberoffollowers,
      color: profileMode === "professional" ? "indigo" : "orange",
      description: "People following you",
    },
    {
      id: "following",
      path: "/account/following",
      icon: UserPlus,
      label: "Following",
      count: overview.numberoffollowing,
      color: profileMode === "professional" ? "teal" : "yellow",
      description: "People you follow",
    },
    {
      id: "password",
      path: "/resetpassword",
      icon: Lock,
      label: "Change Password",
      color: "gray",
      description: "Update your security",
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 border-blue-200",
      purple:
        "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 border-purple-200",
      pink: "bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 hover:from-pink-100 hover:to-pink-200 border-pink-200",
      green:
        "bg-gradient-to-br from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 border-green-200",
      red: "bg-gradient-to-br from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 border-red-200",
      yellow:
        "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700 hover:from-yellow-100 hover:to-yellow-200 border-yellow-200",
      gray: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 border-gray-200",
      indigo:
        "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200 border-indigo-200",
      orange:
        "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border-orange-200",
      teal: "bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 hover:from-teal-100 hover:to-teal-200 border-teal-200",
      cyan: "bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700 hover:from-cyan-100 hover:to-cyan-200 border-cyan-200",
    }
    return colors[color] || colors.gray
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => console.log(overview)}></button>

      {/* Logout Confirmation Toast */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 ${
            isProfessional
              ? "bg-slate-100 text-slate-700"
              : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
          }`}
        >
          <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-slate-500" : "bg-purple-500"}`} />
          <span className="text-xs font-medium">Account Dashboard</span>
        </div>
        <h1
          className={`text-3xl font-bold mb-2 ${
            isProfessional
              ? "text-slate-800"
              : "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your {isProfessional ? "professional" : "social"} profile and preferences
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile Card - Left Side */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div
            className={`border-0 shadow-lg rounded-lg h-full ${
              isProfessional
                ? "bg-white/90 backdrop-blur-sm"
                : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
          >
            <div className="text-center p-6 pb-3">
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full overflow-hidden ring-4 shadow-lg bg-gray-100 flex items-center justify-center ${
                      isProfessional ? "ring-blue-200" : "ring-purple-200"
                    }`}
                  >
                    {dpUrl ? (
                      <img
                        src={dpUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <h2 className="text-lg font-semibold mb-1">
                {isProfessional ? overview.professionalName : overview.socialName}
              </h2>

              {/* Bio - Unique per mode */}
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {isProfessional ? overview.professionalBio : overview.socialBio}
              </p>

              {/* Job Title or Hobbies - Unique per mode */}
              {isProfessional ? (
                <p className="text-blue-600 font-medium text-sm">{overview.occupation}</p>
              ) : (
                <p className="text-purple-600 font-medium text-sm">{overview.hobbies}</p>
              )}
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="h-px bg-gray-200" />

              {/* Profile Info - Common + Unique */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-3 h-3" />
                  <span className="font-medium">{overview.username}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="font-medium">{overview.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium">
                    Joined{" "}
                    {new Date(overview.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Stats - Common Fields */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="space-y-1">
                  <div className="font-bold text-lg">{overview.numberoffollowers}</div>
                  <div className="text-xs text-gray-500 font-medium">Followers</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-lg">{overview.numberoffollowing}</div>
                  <div className="text-xs text-gray-500 font-medium">Following</div>
                </div>
              </div>

              {/* Logout Button - Common */}
              <button
                onClick={handleLogoutClick}
                className="w-full h-9 font-medium rounded-lg transition-all duration-200 border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons Grid - Right Side */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
          <div
            className={`border-0 shadow-lg rounded-lg h-full ${
              isProfessional
                ? "bg-white/90 backdrop-blur-sm"
                : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
          >
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div
                  className={`p-2 rounded-lg ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-pink-500 to-purple-600"
                  }`}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                Account Actions
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {actionButtons.map((button, index) => {
                  const Icon = button.icon
                  return (
                    <motion.div
                      key={button.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => navigate(button.path)}
                        className={`w-full h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 border rounded-lg shadow-sm hover:shadow-md backdrop-blur-sm ${getColorClasses(button.color)}`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/80 shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-center space-y-1">
                          <div className="font-semibold text-sm">{button.label}</div>
                          <div className="text-xs opacity-75">{button.description}</div>
                          <span className="inline-flex items-center px-2 py-0 rounded-full text-xs font-medium bg-white/60">
                            {button.count}
                          </span>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
