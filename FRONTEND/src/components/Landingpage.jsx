"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Info, X, ArrowRight, Shield, Zap, Award, CheckCircle } from "lucide-react"
import { useEffect } from "react"
import {jwtDecode} from "jwt-decode"

const AppName = import.meta.env.VITE_APP_NAME || "TweniQ"

const Landingpage = () => {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)

  useEffect(() => {
  const token = localStorage.getItem("jwtToken")
  if (token) {
    try {
      const { exp } = jwtDecode(token)
      const isExpired = Date.now() >= exp * 1000
      if (!isExpired) {
        navigate("/pages/home")  // 🔁 Redirect logged-in users
      } else {
        localStorage.removeItem("jwtToken")  // 🔒 Remove expired token
      }
    } catch (err) {
      localStorage.removeItem("jwtToken") // 🛑 Invalid token
    }
  }
}, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-400 via-blue-900 to-indigo-400"></div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-cyan-500/20 animate-pulse-slow"></div>

        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)
            `,
              animation: "float 20s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
              animation: "grid-drift 30s linear infinite",
            }}
          ></div>
        </div>
      </div>

     {/* Floating Elements */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* Existing and Additional Floating Particles */}
  <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400/40 rounded-full animate-float-1"></div>
  <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-float-2"></div>
  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400/40 rounded-full animate-float-3"></div>
  <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-indigo-400/60 rounded-full animate-float-4"></div>
  <div className="absolute top-1/5 right-1/4 w-1.5 h-1.5 bg-yellow-400/50 rounded-full animate-float-5"></div>
  <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-float-6"></div>
  <div className="absolute bottom-1/5 right-1/6 w-2 h-2 bg-pink-400/50 rounded-full animate-float-7"></div>
  <div className="absolute top-1/6 left-1/4 w-1 h-1 bg-orange-400/60 rounded-full animate-float-8"></div>
  <div className="absolute bottom-1/6 right-1/3 w-2.5 h-2.5 bg-teal-400/50 rounded-full animate-float-9"></div>
  <div className="absolute top-1/8 right-1/8 w-2 h-2 bg-red-400/40 rounded-full animate-float-10"></div>
  <div className="absolute bottom-1/8 left-1/8 w-1.5 h-1.5 bg-lime-400/50 rounded-full animate-float-11"></div>
  <div className="absolute bottom-2/3 left-2/3 w-1.5 h-1.5 bg-gray-400/60 rounded-full animate-float-12"></div>
  <div className="absolute top-1/10 left-1/5 w-1 h-1 bg-pink-300/50 rounded-full animate-float-13"></div>
  <div className="absolute bottom-1/10 right-1/7 w-2 h-2 bg-violet-400/50 rounded-full animate-float-14"></div>
  <div className="absolute top-1/12 left-1/3 w-1.5 h-1.5 bg-cyan-300/50 rounded-full animate-float-15"></div>
</div>


      {/* Info Button */}
      <button
        onClick={() => setShowInfoModal(true)}
        className="fixed top-6 right-6 z-30 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 
                   rounded-full flex items-center justify-center text-white hover:bg-white/20 
                   transition-all duration-300 hover:scale-110 group shadow-lg animate-fade-in-delay"
      >
        <Info className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Main Content */}
      <div className="absolute w-full flex flex-col items-center" style={{ top: "15vh" }}>
        {/* App Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-md 
                        border border-white/15 rounded-full mb-8 shadow-lg animate-fade-in"
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-white/90 font-medium text-sm tracking-wide">{AppName}</span>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-6 animate-slide-up">
          <h1
            className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-200 
                         font-bold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-3"
          >
            WELCOME TO
          </h1>
          <h2
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 
                         font-bold text-4xl md:text-5xl lg:text-6xl tracking-wide"
          >
            {AppName.toUpperCase()}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-blue-100/80 text-xl md:text-2xl font-light text-center max-w-2xl px-4 mb-10 animate-fade-in-up">
For the You… and the You        </p>

        {/* Feature Attributes */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 px-4 animate-slide-in-features">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full">
            <Zap className="w-4 h-4 text-blue-300" />
            <span className="text-white/90 font-medium text-sm">Seamless</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full">
            <Shield className="w-4 h-4 text-green-300" />
            <span className="text-white/90 font-medium text-sm">Secure</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full">
            <Award className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 font-medium text-sm">Trusted</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full">
            <CheckCircle className="w-4 h-4 text-purple-300" />
            <span className="text-white/90 font-medium text-sm">Reliable</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 px-4 mb-8 animate-slide-in-buttons">
          <button
            onClick={() => navigate("/signup")}
            className="group relative px-10 py-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 
                       backdrop-blur-sm border border-white/25 rounded-2xl text-white font-semibold 
                       text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl 
                       hover:from-blue-500 hover:to-purple-500 overflow-hidden"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 
                             opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
            ></span>
            <div className="relative flex items-center gap-3">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("/signin")}
            className="group relative px-10 py-4 bg-white/12 backdrop-blur-md border border-white/30 
                       rounded-2xl text-white font-semibold text-lg transition-all duration-300 
                       hover:scale-105 hover:bg-white/20 hover:shadow-2xl overflow-hidden"
          >
            <span
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 
                             transition-opacity blur-xl"
            ></span>
            <div className="relative flex items-center gap-3">
              <span>Sign In</span>
              <div className="w-2 h-2 bg-blue-300 rounded-full group-hover:animate-pulse"></div>
            </div>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-green-300/70 text-sm animate-fade-in-status">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-mono">Platform Online</span>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInfoModal(false)}></div>

          {/* Modal */}
          <div
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                          shadow-2xl max-w-md w-full p-6 text-white animate-modal-content"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 
                         rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
           <div className="pr-8">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
      <Info className="w-5 h-5 text-blue-300" />
    </div>
    <h3 className="text-xl font-bold">Platform Information</h3>
  </div>

  {/* Tweniq Description */}
  <div className="text-sm text-white/90 mb-6">
    <p className="mb-2 font-medium text-white">
      Tweniq is a dual-mode social platform that lets you seamlessly switch between your personal and professional identities.
    </p>
    <p>
      Create posts, enjoy your feed, and chat with friends — all with two identities. Tweniq is built for both sides of you —
      social and professional. Switch effortlessly, express freely, and keep both identities active in one seamless space.
    </p>
  </div>

  <div className="space-y-4 text-sm text-white/80">
    <p>
      <strong className="text-white">Version:</strong> 1.0.0 
    </p>
    <p>
      <strong className="text-white">Status:</strong>
      <span className="text-green-300 ml-1">Fully Operational</span>
    </p>
    
  </div>

  <div className="mt-6 pt-4 border-t border-white/20">
    <p className="text-xs text-white/60 text-center mb-1">
      For the You… and the You
    </p>
    <p className="text-xs text-white/60 text-center">
      BY: <span className="text-white">Tanish Dhingra</span> | 
      <a
        href="mailto:tanishdingra2003@gmail.com"
        className="text-blue-300 hover:underline ml-1"
      >
        tanishdingra2003@gmail.com
      </a>
    </p>
  </div>
</div>

          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        @keyframes grid-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
@keyframes float-1 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(20px, -20px); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-15px, -10px); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(25px, 15px); }
}

@keyframes float-4 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-10px, 10px); }
}

@keyframes float-5 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(30px, -15px); }
}

@keyframes float-6 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-12px, 12px); }
}

@keyframes float-7 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(18px, -25px); }
}

@keyframes float-8 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-22px, 20px); }
}

@keyframes float-9 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(14px, -14px); }
}

@keyframes float-10 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-28px, 18px); }
}

@keyframes float-11 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(16px, -20px); }
}

@keyframes float-12 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-24px, 12px); }
}

@keyframes float-13 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(20px, -18px); }
}

@keyframes float-14 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(-15px, 15px); }
}

@keyframes float-15 {
  0%, 100% { transform: translate(0px, 0px); }
  50% { transform: translate(25px, 10px); }
}


        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-features {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slide-in-buttons {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes modal-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-content {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

      .animate-float-1 {
  animation: float-1 6s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 7s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 8s ease-in-out infinite;
}

.animate-float-4 {
  animation: float-4 9s ease-in-out infinite;
}

.animate-float-5 {
  animation: float-5 10s ease-in-out infinite;
}

.animate-float-6 {
  animation: float-6 11s ease-in-out infinite;
}

.animate-float-7 {
  animation: float-7 6.5s ease-in-out infinite;
}

.animate-float-8 {
  animation: float-8 7.5s ease-in-out infinite;
}

.animate-float-9 {
  animation: float-9 8.5s ease-in-out infinite;
}

.animate-float-10 {
  animation: float-10 9.5s ease-in-out infinite;
}

.animate-float-11 {
  animation: float-11 10.5s ease-in-out infinite;
}

.animate-float-12 {
  animation: float-12 11.5s ease-in-out infinite;
}

.animate-float-13 {
  animation: float-13 6.7s ease-in-out infinite;
}

.animate-float-14 {
  animation: float-14 7.7s ease-in-out infinite;
}

.animate-float-15 {
  animation: float-15 8.7s ease-in-out infinite;
}

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }

        .animate-slide-in-features {
          animation: slide-in-features 0.8s ease-out 0.6s both;
        }

        .animate-slide-in-buttons {
          animation: slide-in-buttons 0.8s ease-out 0.8s both;
        }

        .animate-fade-in-status {
          animation: fade-in 0.8s ease-out 1s both;
        }

        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }

        .animate-modal-content {
          animation: modal-content 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Landingpage
