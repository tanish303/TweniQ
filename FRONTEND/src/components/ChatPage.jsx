"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useProfile } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Search,
  MessageCircle,
  Users,
  Send,
  Trash2,
  User,
  TrendingUp,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react"

const API = import.meta.env.VITE_API_BASE_URL

export default function ChatPage() {
  const { profileMode } = useProfile()
  const [query, setQuery] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [error, setError] = useState("")
  const [convos, setConvos] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const isProfessional = profileMode === "professional"

  const tokenHeader = {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  }

  // 🗑️ Delete a conversation
  const deleteConversation = async (roomId) => {
    const confirmDelete = window.confirm("Delete this conversation?")
    if (!confirmDelete) return

    try {
      await axios.delete(`${API}/chat/room/${roomId}`, {
        headers: tokenHeader,
      })
      setConvos((prev) => prev.filter((c) => c.roomId !== roomId))
    } catch (err) {
      console.error("Failed to delete conversation", err)
      setError("Could not delete conversation.")
    }
  }

  // 🔍 Search user
  const handleSearch = async () => {
    setError("")
    setSearchResult(null)
    if (!query.trim()) {
      setError("Please enter a username.")
      return
    }

    setIsSearching(true)
    try {
      const { data } = await axios.get(`${API}/chat/search`, {
        params: { q: query, mode: profileMode },
        headers: tokenHeader,
      })
      setSearchResult(data.user)
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found.")
      } else {
        setError("Something went wrong. Try again.")
      }
    } finally {
      setIsSearching(false)
    }
  }

  // 💬 Load conversation list
  useEffect(() => {
    axios
      .get(`${API}/chat/conversations`, {
        params: { mode: profileMode },
        headers: tokenHeader,
      })
      .then((res) => setConvos(res.data.conversations))
      .catch((err) => {
        console.error("Error loading conversations", err)
        setError("Failed to load conversations.")
      })
  }, [profileMode])

  // ✉️ Start or go to chat
  const startChat = async (otherId) => {
    try {
      const { data } = await axios.post(
        `${API}/chat/room`,
        { otherUserId: otherId, mode: profileMode },
        { headers: tokenHeader },
      )
      navigate(`/chat/${data.roomId}`)
    } catch {
      setError("Failed to start chat.")
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isProfessional
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
          : "bg-gradient-to-br from-purple-100 via-pink-50  to-yellow-50"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              isProfessional
                ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
                : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium text-sm">{isProfessional ? "Professional" : "Social"} Messaging</span>
          </div>

          <h1
            className={`text-3xl font-bold mb-3 ${
              isProfessional
                ? "text-slate-800"
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            }`}
          >
            Messages
          </h1>
          <p className="text-gray-600">Connect and communicate with your network</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className={`border-0 shadow-lg rounded-lg ${
                isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
              }`}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center gap-2 text-lg font-semibold mb-6">
                  <div
                    className={`p-2 rounded-lg ${
                      isProfessional
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-pink-500 to-purple-600"
                    }`}
                  >
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  Find People
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isProfessional
                        ? "focus:border-blue-500 focus:ring-blue-500/20 border-gray-200"
                        : "focus:border-purple-500 focus:ring-purple-500/20 border-gray-200"
                    }`}
                    placeholder="Search username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700"
                  }`}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <motion.div
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Search Result */}
                {searchResult && (
                  <motion.div
                    className={`border-0 shadow-md rounded-lg overflow-hidden ${
                      isProfessional ? "bg-slate-50" : "bg-gradient-to-r from-pink-50 to-purple-50"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
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
                          <h3 className="font-semibold text-gray-900">@{searchResult.username}</h3>
                          {isProfessional && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Pro</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{searchResult.posts} posts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{searchResult.followers} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserPlus className="w-3 h-3" />
                          <span>{searchResult.following} following</span>
                        </div>
                      </div>

                      <button
                        onClick={() => startChat(searchResult._id)}
                        className={`w-full py-2 font-medium rounded-lg transition-all duration-200 flex items-center justify-center text-white ${
                          isProfessional
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        }`}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Start Chat
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Conversations List */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className={`border-0 shadow-lg rounded-lg ${
                isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
              }`}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <div
                      className={`p-2 rounded-lg ${
                        isProfessional
                          ? "bg-gradient-to-r from-slate-500 to-gray-600"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    Conversations
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      isProfessional ? "bg-slate-100 text-slate-700" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {convos.length} active
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6">
                {convos.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isProfessional
                          ? "bg-gradient-to-r from-slate-100 to-blue-100"
                          : "bg-gradient-to-r from-pink-100 to-purple-100"
                      }`}
                    >
                      <MessageCircle className={`w-8 h-8 ${isProfessional ? "text-blue-600" : "text-purple-600"}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No conversations yet</h3>
                    <p className="text-gray-500">Search for someone to start chatting!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {convos.map((c, index) => (
                      <motion.div
                        key={c.roomId}
                        className={`group p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                          isProfessional
                            ? "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                            : "border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/chat/${c.roomId}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                isProfessional
                                  ? "bg-gradient-to-r from-slate-500 to-gray-600"
                                  : "bg-gradient-to-r from-pink-500 to-purple-600"
                              }`}
                            >
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{c.username}</h4>
                              <p className="text-sm text-gray-500">Click to open chat</p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(c.roomId)
                            }}
                            className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${
                              isProfessional ? "text-red-600 hover:bg-red-50" : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
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
