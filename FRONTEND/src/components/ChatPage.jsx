"use client"

import { motion } from "framer-motion"
import { MessageCircle, Users, Search, Plus, Zap, Clock, Shield } from "lucide-react"
import { useProfile } from "../context/AppContext"

export default function ChatPage() {
  const { profileMode } = useProfile()
  const isProfessional = profileMode === "professional"

  const features = [
    {
      icon: MessageCircle,
      title: "Direct Messages",
      description: isProfessional
        ? "Private conversations with your professional network"
        : "Chat privately with your friends and family",
      color: isProfessional ? "blue" : "pink",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: isProfessional
        ? "Collaborate with teams and project groups"
        : "Create fun group chats with your friend circles",
      color: isProfessional ? "green" : "purple",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find messages and conversations instantly with AI-powered search",
      color: isProfessional ? "indigo" : "orange",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Messages sync instantly across all your devices",
      color: isProfessional ? "teal" : "cyan",
    },
    {
      icon: Clock,
      title: "Message History",
      description: "Access your complete conversation history anytime",
      color: isProfessional ? "slate" : "yellow",
    },
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your conversations are secure and private",
      color: isProfessional ? "emerald" : "red",
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      pink: "from-pink-500 to-pink-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      indigo: "from-indigo-500 to-indigo-600",
      orange: "from-orange-500 to-orange-600",
      teal: "from-teal-500 to-teal-600",
      cyan: "from-cyan-500 to-cyan-600",
      slate: "from-slate-500 to-slate-600",
      yellow: "from-yellow-500 to-yellow-600",
      emerald: "from-emerald-500 to-emerald-600",
      red: "from-red-500 to-red-600",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div
            className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
              isProfessional
                ? "bg-gradient-to-br from-slate-100 to-blue-100"
                : "bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100"
            }`}
          >
            <MessageCircle className={`w-10 h-10 ${isProfessional ? "text-blue-600" : "text-purple-600"}`} />
          </div>

          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                isProfessional
                  ? "bg-slate-100 text-slate-700"
                  : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
              }`}
            >
              <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-slate-500" : "bg-purple-500"}`} />
              <span className="text-xs font-medium">Coming Soon</span>
            </div>

            <h1
              className={`text-3xl font-bold ${
                isProfessional
                  ? "text-slate-800"
                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent"
              }`}
            >
              {isProfessional ? "Professional Messaging" : "Social Chat"}
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
              {isProfessional
                ? "Connect and communicate with your professional network. Advanced messaging features for business."
                : "Stay connected with friends and family through our engaging chat platform."}
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div
            className={`max-w-lg mx-auto border-0 shadow-lg rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
          >
            <div className="p-6 pb-4">
              <h2 className="text-lg text-center font-semibold">We're Building Something Amazing</h2>
            </div>
            <div className="p-6 pt-0 text-center space-y-6">
              <div
                className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center ${
                  isProfessional
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : "bg-gradient-to-r from-pink-500 to-purple-600"
                }`}
              >
                <Users className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">Chat Experience Reimagined</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're crafting the perfect messaging experience for both professional networking and social
                  connections.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-blue-500" : "bg-purple-500"}`} />
                  <span>Real-time messaging</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-blue-500" : "bg-purple-500"}`} />
                  <span>File sharing</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-blue-500" : "bg-purple-500"}`} />
                  <span>Voice messages</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-blue-500" : "bg-purple-500"}`} />
                  <span>Video calls</span>
                </div>
              </div>

              <button
                disabled
                className={`w-full h-10 font-medium rounded-lg transition-all duration-200 border flex items-center justify-center opacity-50 cursor-not-allowed ${
                  isProfessional ? "border-blue-200 text-blue-600" : "border-purple-200 text-purple-600"
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Start New Chat
              </button>
            </div>
          </div>
        </motion.div>

        {/* Feature Preview Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <div
                className={`h-full text-center border-0 shadow-md transition-all duration-200 hover:shadow-lg rounded-lg ${
                  isProfessional ? "bg-white" : "bg-gradient-to-br from-white/80 to-purple-50/30 backdrop-blur-sm"
                }`}
              >
                <div className="p-4 space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center bg-gradient-to-r ${getColorClasses(feature.color)} shadow-md`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-3"
        >
          <h3 className="text-lg font-bold text-gray-800">Stay Updated</h3>
          <p className="text-gray-600">Be the first to know when messaging goes live!</p>
          <button
            className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 shadow-md text-white ${
              isProfessional
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700"
            }`}
          >
            Notify Me When Ready
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
