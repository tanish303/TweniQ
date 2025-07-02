"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import {
  User,
  Bookmark,
  FileText,
  Heart,
  Lock,
  Users,
  UserPlus,
  Settings,
  Edit3,
  Mail,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
} from "lucide-react"
import { useProfile } from "../context/AppContext"

const userStats = {
  professional: {
    name: "Dr. Sarah Johnson",
    title: "Senior Data Scientist",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    email: "sarah.johnson@techcorp.com",
    joinDate: "January 2022",
    posts: 127,
    followers: 2840,
    following: 456,
    saved: 89,
    achievements: 12,
  },
  social: {
    name: "Sarah ✨",
    bio: "Coffee lover ☕ | Adventure seeker 🏔️ | Dog mom 🐕",
    location: "San Francisco",
    joinDate: "January 2022",
    posts: 234,
    followers: 1250,
    following: 890,
    liked: 1456,
    saved: 156,
    streaks: 45,
  },
}

export default function AccountPage() {
  const { profileMode } = useProfile()
  const [activeSection, setActiveSection] = useState(null)
  const isProfessional = profileMode === "professional"
  const navigate = useNavigate();

  const stats = isProfessional ? userStats.professional : userStats.social
const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
   
    navigate("/"); // Optional redirect
  };

  const actionButtons = [
    {
      id: "saved",
      icon: Bookmark,
      label: "Saved Posts",
      count: stats.saved,
      color: isProfessional ? "blue" : "purple",
      description: "Posts you've bookmarked",
    },
    {
      id: "created",
      icon: FileText,
      label: "Created Posts",
      count: stats.posts,
      color: isProfessional ? "green" : "pink",
      description: "Content you've shared",
    },
    ...(isProfessional
      ? [
          {
            id: "achievements",
            icon: Award,
            label: "Achievements",
            count: stats.achievements,
            color: "yellow",
            description: "Professional milestones",
          },
        ]
      : [
          {
            id: "liked",
            icon: Heart,
            label: "Liked Posts",
            count: stats.liked,
            color: "red",
            description: "Posts you've liked",
          },
        ]),
    {
      id: "password",
      icon: Lock,
      label: "Change Password",
      color: "gray",
      description: "Update your security",
    },
    {
      id: "followers",
      icon: Users,
      label: "Your Followers",
      count: stats.followers,
      color: isProfessional ? "indigo" : "orange",
      description: "People following you",
    },
    {
      id: "following",
      icon: UserPlus,
      label: "Your Following",
      count: stats.following,
      color: isProfessional ? "teal" : "cyan",
      description: "People you follow",
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
 <button onClick={logout} className="bg-amber-400">logout</button>
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div
            className={`border-0 shadow-lg rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
          >
            <div className="text-center p-6 pb-3">
              <div className="relative mx-auto mb-4">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                  <img src="/placeholder.svg?height=80&width=80" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-1 -right-1 rounded-full w-7 h-7 p-0 shadow-md border bg-white hover:bg-gray-50 flex items-center justify-center">
                  <Edit3 className="w-3 h-3" />
                </button>
                <div
                  className={`absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-white ${
                    isProfessional ? "bg-green-500" : "bg-pink-500"
                  }`}
                />
              </div>

              <h2 className="text-lg font-semibold mb-1">{stats.name}</h2>

              {isProfessional ? (
                <div className="space-y-1">
                  <p className="text-blue-600 font-medium text-sm">{stats.title}</p>
                  <p className="text-gray-600 text-sm">{stats.company}</p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">{stats.bio}</p>
              )}
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="h-px bg-gray-200" />

              {/* Profile Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="font-medium">{stats.location}</span>
                </div>

                {isProfessional && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span className="font-medium">{stats.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium">Joined {stats.joinDate}</span>
                </div>

                {!isProfessional && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium">{stats.streaks} day streak</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-200" />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="space-y-1">
                  <div className="font-bold text-lg">{stats.posts}</div>
                  <div className="text-xs text-gray-500 font-medium">Posts</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-lg">{stats.followers}</div>
                  <div className="text-xs text-gray-500 font-medium">Followers</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-lg">{stats.following}</div>
                  <div className="text-xs text-gray-500 font-medium">Following</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-lg">{stats.saved}</div>
                  <div className="text-xs text-gray-500 font-medium">Saved</div>
                </div>
              </div>

              <button
                className={`w-full h-9 font-medium rounded-lg transition-all duration-200 border flex items-center justify-center ${
                  isProfessional
                    ? "border-blue-200 text-blue-600 hover:bg-blue-50"
                    : "border-purple-200 text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons Grid */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
          <div
            className={`border-0 shadow-lg rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
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
                        onClick={() => setActiveSection(button.id)}
                        className={`w-full h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 border rounded-lg shadow-sm hover:shadow-md ${getColorClasses(button.color)}`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/80 shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="text-center space-y-1">
                          <div className="font-semibold text-sm">{button.label}</div>
                          <div className="text-xs opacity-75">{button.description}</div>
                          {button.count !== undefined && (
                            <span className="inline-flex items-center px-2 py-0 rounded-full text-xs font-medium bg-white/60">
                              {button.count}
                            </span>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>

              {/* Active Section Preview */}
              {activeSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="text-center space-y-3">
                    <div className="text-lg font-semibold text-gray-800">
                      {actionButtons.find((b) => b.id === activeSection)?.label}
                    </div>
                    <p className="text-gray-600">
                      This feature will show your {activeSection.replace("_", " ")} content. Full functionality coming
                      soon!
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setActiveSection(null)}
                        className="px-4 py-1 rounded-lg text-sm border hover:bg-white transition-colors"
                      >
                        Close Preview
                      </button>
                      <button
                        className={`px-4 py-1 rounded-lg text-sm text-white ${
                          isProfessional ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
