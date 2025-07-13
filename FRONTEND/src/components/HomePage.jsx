"use client"

import { motion } from "framer-motion"
import { PlusCircle, MessageCircle, User, Sparkles, TrendingUp, Users, Zap, ArrowRight } from "lucide-react"
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-28 md:pb-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 md:mb-8"
      >
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 md:px-3 md:py-1.5 rounded-full mb-4 md:mb-3 ${
            isProfessional
              ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
              : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
          }`}
        >
          <Zap className="w-4 h-4 md:w-3 md:h-3" />
          <span className="font-medium text-sm md:text-xs">
            Welcome to {isProfessional ? "Professional" : "Social"} Mode
          </span>
        </div>
        <h1
          className={`text-4xl md:text-3xl font-bold mb-3 md:mb-2 ${
            isProfessional
              ? "text-slate-800"
              : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          }`}
        >
          TweniQ
        </h1>
        <p
          className={`text-lg md:text-base max-w-lg mx-auto px-2 ${isProfessional ? "text-slate-600" : "text-gray-600"}`}
        >
          {isProfessional
            ? "Connect and grow your professional network with industry leaders."
            : "Share your world and connect with friends in a vibrant community."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4 max-w-3xl w-full">
        {navigationCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div
                className={`h-full cursor-pointer overflow-hidden border-0 shadow-md bg-gradient-to-br ${card.bgGradient} hover:shadow-lg transition-all duration-300 rounded-xl md:rounded-lg transform hover:scale-105 active:scale-95`}
                onClick={() => onNavigate(card.id)}
              >
                <div className="p-6 md:p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 md:mb-3">
                    <div
                      className={`p-3 md:p-2.5 rounded-xl md:rounded-lg bg-gradient-to-r ${card.gradient} shadow-sm`}
                    >
                      <Icon className="w-6 h-6 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className={`w-2 h-2 md:w-1.5 md:h-1.5 rounded-full bg-gradient-to-r ${card.gradient}`} />
                  </div>
                  <h3 className="text-xl md:text-lg font-bold mb-3 md:mb-2 text-gray-800">{card.title}</h3>
                  <p className="text-gray-600 mb-5 md:mb-4 flex-grow leading-relaxed text-base md:text-sm">
                    {card.description}
                  </p>
                  <motion.button
                    className={`w-full py-3 md:py-2.5 font-semibold rounded-xl md:rounded-lg bg-gradient-to-r ${card.gradient} hover:shadow-md transition-all duration-200 text-white flex items-center justify-center gap-2 group`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base md:text-sm">Continue</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="w-5 h-5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Enhanced Mobile-Friendly Spacing */}
      <div className="h-8 md:h-0" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {!isProfessional ? (
          <>
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 bg-pink-300/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-32 md:bottom-20 right-20 w-16 h-16 bg-purple-300/15 rounded-full blur-lg"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute top-1/2 right-10 w-12 h-12 bg-indigo-300/10 rounded-full blur-md"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-32 right-16 w-18 h-18 bg-blue-200/8 rounded-full blur-lg"
              animate={{
                scale: [1, 1.1, 1],
                x: [0, 15, 0],
              }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-40 md:bottom-32 left-16 w-14 h-14 bg-slate-300/6 rounded-full blur-md"
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 18,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
