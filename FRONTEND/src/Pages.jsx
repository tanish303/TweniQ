"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, PlusCircle, MessageCircle, User, Briefcase, Heart } from "lucide-react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { useProfile } from "./context/AppContext"

export default function Pages() {
  const { profileMode, toggleProfile } = useProfile()
  const navigate = useNavigate()
  const location = useLocation()

  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname
    if (path === "/pages" || path === "/pages/home") return "home"
    if (path === "/pages/feed") return "feed"
    if (path === "/pages/create") return "create"
    if (path === "/pages/chat") return "chat"
    if (path === "/pages/account") return "account"
    return "home"
  }

  const activeTab = getCurrentTab()
  const isProfessional = profileMode === "professional"

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/pages/home" },
    { id: "feed", label: "Feed", icon: Home, path: "/pages/feed" },
    { id: "create", label: "Create", icon: PlusCircle, path: "/pages/create" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/pages/chat" },
    { id: "account", label: "Account", icon: User, path: "/pages/account" },
  ]

  const navigateToTab = (tab) => {
    const navItem = navItems.find((item) => item.id === tab)
    if (navItem) {
      navigate(navItem.path)
    }
  }

  // Redirect to home if on base /pages route
  useEffect(() => {
    if (location.pathname === "/pages") {
      navigate("/pages/home", { replace: true })
    }
  }, [location.pathname, navigate])

  const themeClasses = isProfessional
    ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    : "bg-gradient-to-br from-purple-100 via-pink-50 via-orange-50 to-yellow-50"

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Profile Toggle Button with Advanced Animation */}
      <div className="fixed top-4 left-4 z-40 md:block">
        <motion.button
          onClick={toggleProfile}
          className={`relative overflow-hidden px-3 py-2 md:px-6 md:py-2 rounded-xl font-semibold transition-all duration-500 shadow-lg hover:cursor-pointer text-xs md:text-sm ${
            isProfessional
              ? "bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 hover:from-slate-800 hover:via-blue-800 hover:to-indigo-800 text-white"
              : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 text-white"
          }`}
          whileHover={{
            scale: 1.05,
            boxShadow: isProfessional ? "0 20px 40px rgba(59, 130, 246, 0.4)" : "0 20px 40px rgba(236, 72, 153, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              background: isProfessional
                ? "linear-gradient(45deg, #334155, #1e40af, #3730a3)"
                : "linear-gradient(45deg, #ec4899, #8b5cf6, #4f46e5)",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-30"
            animate={{
              background: isProfessional
                ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.6) 0%, transparent 70%)"
                : "radial-gradient(circle at center, rgba(236, 72, 153, 0.6) 0%, transparent 70%)",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          {/* Content Container */}
          <div className="relative z-10 flex items-center gap-1 md:gap-2">
            {/* Icon Animation */}
            <div className="relative w-3 h-3 md:w-4 md:h-4">
              <AnimatePresence mode="wait">
                {isProfessional ? (
                  <motion.div
                    key="professional"
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: -180,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: 180,
                      y: -20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="absolute inset-0"
                  >
                    <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="social"
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: -180,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: 180,
                      y: -20,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="absolute inset-0"
                  >
                    <Heart className="w-3 h-3 md:w-4 md:h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Text Animation */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isProfessional ? (
                  <motion.span
                    key="professional-text"
                    initial={{
                      opacity: 0,
                      x: 30,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      x: -30,
                      filter: "blur(4px)",
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: 0.1,
                    }}
                    className="block"
                  >
                    <span className="hidden sm:inline">Professional</span>
                    <span className="sm:hidden">Pro</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="social-text"
                    initial={{
                      opacity: 0,
                      x: 30,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      x: -30,
                      filter: "blur(4px)",
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: 0.1,
                    }}
                    className="block"
                  >
                    Social
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 -skew-x-12 opacity-0"
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
          />
          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          />
        </motion.button>
      </div>

      {/* Desktop Top Navigation Bar */}
      <div className="hidden md:block fixed top-4 right-4 z-30">
        <div
          className={`px-2 py-2 backdrop-blur-xl border-0 shadow-lg rounded-lg ${
            isProfessional ? "bg-white/90 border-slate-200" : "bg-white/80 border-purple-200"
          }`}
        >
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => navigateToTab(item.id)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                      isActive
                        ? isProfessional
                          ? "bg-slate-100 text-slate-700 shadow-sm font-medium"
                          : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 shadow-sm font-medium"
                        : "hover:bg-gray-100/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </button>
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        isProfessional ? "bg-slate-600" : "bg-gradient-to-r from-pink-500 to-purple-600"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div
          className={`backdrop-blur-xl border-t shadow-2xl ${
            isProfessional ? "bg-white/98 border-slate-200" : "bg-white/98 border-purple-200"
          }`}
        >
          <div className="flex justify-around items-center px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToTab(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                    isActive
                      ? isProfessional
                        ? "text-slate-700"
                        : "text-purple-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 mb-1 ${isActive ? "scale-110" : ""} transition-transform duration-200`} />
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-active-indicator"
                        className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                          isProfessional ? "bg-slate-600" : "bg-gradient-to-r from-pink-500 to-purple-600"
                        }`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className={`text-xs font-medium truncate ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Home Button */}
      {activeTab !== "home" && (
        <div className="hidden md:block fixed bottom-4 left-4 z-30">
          <button
            onClick={() => navigateToTab("home")}
            className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center ${
              isProfessional
                ? "bg-slate-600 hover:bg-slate-700"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            }`}
          >
            <Home className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Main Content - Rendered by React Router */}
      <div
        className={`${activeTab === "home" ? "p-0" : "pt-16 px-6 pb-6 md:pb-6"} ${activeTab !== "home" ? "pb-24 md:pb-6" : "pb-0 md:pb-0"}`}
      >
        <motion.div
          key={`${activeTab}-${profileMode}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
