"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { useProfile } from "../context/AppContext"
import { Link } from "react-router-dom";
import { checkTokenValidity } from "../utils/checkToken"

import {
  ArrowLeft,
  User,
  Heart,
  Bookmark,
  FileText,
  Users,
  UserPlus,
  MessageCircle,
  Calendar,
  Loader2,
} from "lucide-react"

export default function ViewPersonalStats() {
  const APIURL = import.meta.env.VITE_API_BASE_URL
  const { profileMode } = useProfile()
  const { category } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isProfessional = profileMode === "professional"
  const isUserList = category === "followers" || category === "following"

  const buildEndpoint = () =>
    isUserList ? `${APIURL}/account/${category}` : `${APIURL}/account/${category}?mode=${profileMode}`

  useEffect(() => {
    const fetchData = async () => {
      if (!checkTokenValidity()) return;

      try {
        setLoading(true)
        const token = localStorage.getItem("jwtToken")
        if(!token){alert("You must logged In");}
        const res = await axios.get(buildEndpoint(), {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData(isUserList ? res.data.users || [] : res.data.posts || [])
        console.log("📦 Fetched:", res.data)
      } catch (err) {
        console.error("❌ Fetch failed", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [profileMode, category])

  const niceTitleMap = {
    posts: "Your Posts",
    liked: "Posts You've Liked",
    saved: "Saved Posts",
    followers: "Your Followers",
    following: "You're Following",
  }

  const iconMap = {
    posts: FileText,
    liked: Heart,
    saved: Bookmark,
    followers: Users,
    following: UserPlus,
  }

  const niceTitle = niceTitleMap[category] || "Account Data"
  const IconComponent = iconMap[category] || FileText

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-all duration-500 ${
          isProfessional
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
            : "bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            className="flex flex-col items-center justify-center h-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isProfessional
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                  : "bg-gradient-to-r from-pink-500 to-purple-600"
              }`}
            >
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">Loading {niceTitle.toLowerCase()}...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-screen transition-all duration-500 ${
          isProfessional
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
            : "bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            className="flex flex-col items-center justify-center h-60 text-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <IconComponent className="w-8 h-8 text-red-600" />
            </div>
            <p className="font-medium">{error}</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isProfessional
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
          : "bg-gradient-to-br from-purple-100 via-pink-50  to-yellow-50"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isProfessional
              ? "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              : "text-purple-600 hover:text-purple-800 hover:bg-purple-100"
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -2 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </motion.button>

        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              isProfessional
                ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
                : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span className="font-medium text-sm">{category}</span>
          </div>

          <h1
            className={`text-3xl font-bold mb-2 ${
              isProfessional
                ? "text-slate-800"
                : "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
            }`}
          >
            {niceTitle}
          </h1>
          <p className="text-gray-600">
            {data.length} {data.length === 1 ? "item" : "items"} found
          </p>
        </motion.div>

        {/* Content */}
        {data.length === 0 ? (
          <motion.div
            className={`text-center py-12 border-0 shadow-lg rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isProfessional
                  ? "bg-gradient-to-r from-slate-100 to-blue-100"
                  : "bg-gradient-to-r from-pink-100 to-purple-100"
              }`}
            >
              <IconComponent className={`w-8 h-8 ${isProfessional ? "text-blue-600" : "text-purple-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No {category} yet</h3>
          </motion.div>
        ) : isUserList ? (
          /* User List */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((user, index) => (
              <motion.div
                key={user._id}
                className={`border-0 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isProfessional
                    ? "bg-white hover:shadow-slate-200"
                    : "bg-white/90 backdrop-blur-sm hover:shadow-purple-200/50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                        isProfessional
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                          : "bg-gradient-to-r from-pink-500 to-purple-600"
                      }`}
                    >
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
<h3 className="font-semibold text-gray-900">
  <Link to={`/showuser/${user.username}`} className="text-purple-600 hover:underline">
    {user.username}

  </Link>
</h3>                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Posts Grid */
          <div className="space-y-6">
            {data.map((post, index) => {
              const isPro = profileMode === "professional"
              const votes = post.Poll?.votes || []
              const getCount = (opt) => votes.find((v) => v.option === opt)?.count ?? 0

              return (
                <motion.div
                  key={post._id}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-0 rounded-lg ${
                    isProfessional
                      ? "bg-white shadow-md hover:shadow-slate-200"
                      : "bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-purple-200/50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                          isProfessional
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                            : "bg-gradient-to-r from-pink-500 to-purple-600"
                        }`}
                      >
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{post.ownerName}</h3>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                          {isProfessional && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Pro</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-4">
                      <h2 className={`text-lg font-semibold ${isProfessional ? "text-slate-800" : "text-gray-900"}`}>
                        {post.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">{post.content || post.text || ""}</p>

                      {/* Social Mode Extras */}
                      {!isPro && (
                        <>
                        {post.mood && (
                            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 rounded-lg border border-purple-100">
                              <span className="text-2xl">{post.moodEmoji}</span>
                              <div>
                                <span className="text-purple-700 font-medium">Feeling {post.mood}</span>
                              </div>
                            </div>
                          )}
                          {post.taggedFriendUsername && (
                            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 via-green-50 to-cyan-50 rounded-lg border border-green-100">
                              <User className="w-4 h-4 text-green-600" />
                              <span className="text-green-700 font-medium"> @{post.taggedFriendUsername}</span>
                            </div>
                          )}
                          
                        </>
                      )}

                      {/* Professional Poll */}
                      {isPro && post.Poll?.options?.length > 0 && (
                        <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <h4 className="font-medium text-blue-900">Poll Results</h4>
                          <div className="space-y-2">
                            {post.Poll.options.map((opt) => (
                              <div key={opt} className="relative overflow-hidden">
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-200 relative z-10">
                                  <span className="font-medium text-sm">{opt}</span>
                                  <span className="text-blue-700 font-semibold text-sm">{getCount(opt)} votes</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                              isProfessional ? "text-green-600 bg-green-50" : "text-pink-600 bg-pink-50"
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                            <span className="font-medium text-sm">{post.likes?.length || 0}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                              isProfessional ? "text-blue-600 bg-blue-50" : "text-purple-600 bg-purple-50"
                            }`}
                          >
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {isProfessional ? (
          <>
            <motion.div
              className="absolute top-32 right-32 w-28 h-28 bg-blue-200/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.05, 1],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-32 left-32 w-20 h-20 bg-slate-300/8 rounded-full blur-lg"
              animate={{
                scale: [1.05, 1, 1.05],
                rotate: [0, 45, 90],
              }}
              transition={{
                duration: 30,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-pink-300/15 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-40 w-24 h-24 bg-purple-300/20 rounded-full blur-xl"
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [180, 90, 0],
              }}
              transition={{
                duration: 15,
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
