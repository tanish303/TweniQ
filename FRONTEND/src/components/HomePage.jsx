"use client"

import { motion } from "framer-motion"
import { PlusCircle, MessageCircle, User, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useProfile } from "../context/AppContext"

export default function HomePage() {
  const { profileMode } = useProfile()
  const navigate = useNavigate()
  const isProfessional = profileMode === "professional"

  const onNavigate = (tab) => {
    navigate(`/pages/${tab}`)
  }

  const navigationCards = [
    {
      id: "feed",
      title: isProfessional ? "Professional Feed" : "Social Feed",
      description: isProfessional
        ? "Discover industry insights and professional discussions"
        : "See what your friends are up to and share moments",
      icon: isProfessional ? TrendingUp : Sparkles,
      gradient: isProfessional ? "from-blue-500 to-indigo-600" : "from-pink-500 to-purple-600",
      bgGradient: isProfessional ? "from-blue-50 to-indigo-100" : "from-pink-50 to-purple-100",
    },
    {
      id: "create",
      title: "Create Post",
      description: isProfessional
        ? "Share expertise, create polls, and engage professionally"
        : "Express yourself, share your mood, and tag friends",
      icon: PlusCircle,
      gradient: isProfessional ? "from-emerald-500 to-teal-600" : "from-orange-500 to-red-500",
      bgGradient: isProfessional ? "from-emerald-50 to-teal-100" : "from-orange-50 to-red-100",
    },
    {
      id: "chat",
      title: "Messages",
      description: isProfessional
        ? "Network with professionals and build connections"
        : "Chat with friends and stay connected",
      icon: MessageCircle,
      gradient: isProfessional ? "from-violet-500 to-purple-600" : "from-cyan-500 to-blue-500",
      bgGradient: isProfessional ? "from-violet-50 to-purple-100" : "from-cyan-50 to-blue-100",
    },
    {
      id: "account",
      title: "Account",
      description: isProfessional
        ? "Manage your professional profile and settings"
        : "Customize your profile and social presence",
      icon: isProfessional ? Users : User,
      gradient: isProfessional ? "from-slate-500 to-gray-600" : "from-yellow-500 to-orange-500",
      bgGradient: isProfessional ? "from-slate-50 to-gray-100" : "from-yellow-50 to-orange-100",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
            isProfessional
              ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
              : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="font-medium text-sm">Welcome to {isProfessional ? "Professional" : "Social"} Mode</span>
        </div>

        <h1
          className={`text-4xl font-bold mb-3 ${
            isProfessional
              ? "text-slate-800"
              : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          }`}
        >
          SocioFusion
        </h1>

        <p className={`text-lg max-w-xl mx-auto ${isProfessional ? "text-slate-600" : "text-gray-600"}`}>
          {isProfessional
            ? "Connect and grow your professional network with industry leaders."
            : "Share your world and connect with friends in a vibrant community."}
        </p>
      </motion.div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {navigationCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div
                className={`h-full cursor-pointer overflow-hidden border-0 shadow-lg bg-gradient-to-br ${card.bgGradient} hover:shadow-xl transition-all duration-300 rounded-lg`}
                onClick={() => onNavigate(card.id)}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient}`} />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800">{card.title}</h3>

                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{card.description}</p>

                  <button
                    className={`w-full py-3 font-semibold rounded-lg bg-gradient-to-r ${card.gradient} hover:shadow-md transition-all duration-200 text-white`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[
            { label: "Active Users", value: "10K+" },
            { label: "Posts Shared", value: "50K+" },
            { label: "Connections", value: "25K+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className={`text-2xl font-bold mb-1 ${isProfessional ? "text-slate-700" : "text-purple-600"}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
