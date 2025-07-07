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
          : "bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Compact Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs ${
              isProfessional
                ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
                : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            <span className="font-medium">{isProfessional ? "Professional" : "Social"} Messaging</span>
          </div>
          <h1
            className={`text-2xl font-bold mb-2 ${
              isProfessional
                ? "text-slate-800"
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            }`}
          >
            Messages
          </h1>
          <p className="text-gray-600 text-sm">Connect and communicate with your network</p>
        </motion.div>

        {/* Compact Search Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={`border-0 shadow-md rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 text-base font-semibold mb-4">
                <div
                  className={`p-1.5 rounded-lg ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-pink-500 to-purple-600"
                  }`}
                >
                  <Search className="w-3 h-3 text-white" />
                </div>
                Find People
              </div>

              <div className="space-y-3">
                {/* Compact Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
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
                  className={`w-full py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
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
                    className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{error}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compact Search Result */}
        {searchResult && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className={`border-0 shadow-md rounded-lg overflow-hidden ${
                isProfessional ? "bg-slate-50" : "bg-gradient-to-r from-pink-50 to-purple-50"
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {/* Compact DP Image */}
                  {searchResult.dpUrl ? (
                    <img
                      src={`${API}${searchResult.dpUrl}`}
                      alt={searchResult.username}
                      className="w-12 h-12 rounded-full object-cover object-center shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${
                        isProfessional
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                          : "bg-gradient-to-r from-pink-500 to-purple-600"
                      }`}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-indigo-600 mb-1">@{searchResult.username}</h3>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {isProfessional ? "Professional Name" : "Social Name"}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{searchResult.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 mb-3 bg-white/60 rounded-lg p-2.5">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium">{searchResult.posts}</span>
                    <span>posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="font-medium">{searchResult.followers}</span>
                    <span>followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserPlus className="w-3 h-3" />
                    <span className="font-medium">{searchResult.following}</span>
                    <span>following</span>
                  </div>
                </div>

                <button
                  onClick={() => startChat(searchResult._id)}
                  className={`w-full py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center justify-center text-white shadow-sm hover:shadow-md text-sm ${
                    isProfessional
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  }`}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Start Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Compact Conversations List - Vertical */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div
            className={`border-0 shadow-md rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
          >
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isProfessional
                        ? "bg-gradient-to-r from-slate-500 to-gray-600"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500"
                    }`}
                  >
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  Conversations
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isProfessional ? "bg-slate-100 text-slate-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {convos.length} active
                </span>
              </div>
            </div>

            <div className="px-4 pb-4">
              {convos.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      isProfessional
                        ? "bg-gradient-to-r from-slate-100 to-blue-100"
                        : "bg-gradient-to-r from-pink-100 to-purple-100"
                    }`}
                  >
                    <MessageCircle className={`w-6 h-6 ${isProfessional ? "text-blue-600" : "text-purple-600"}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">No conversations yet</h3>
                  <p className="text-gray-500 text-sm">Search for someone to start chatting!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {convos.map((c, index) => (
                    <motion.div
                      key={c.roomId}
                      className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                        isProfessional
                          ? "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                          : "border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/chat/${c.roomId}`)}
                    >
                      <div className="flex items-center gap-3">
                        {c.dpUrl ? (
                          <img
                            src={`${API}${c.dpUrl}`}
                            alt={c.username}
                            className="w-10 h-10 rounded-full object-cover object-center shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${
                              isProfessional
                                ? "bg-gradient-to-r from-slate-500 to-gray-600"
                                : "bg-gradient-to-r from-pink-500 to-purple-600"
                            }`}
                          >
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{c.name}</h4>
                          <p className="text-xs font-medium text-indigo-600 truncate">@{c.username}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteConversation(c.roomId)
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                            isProfessional ? "text-red-600 hover:bg-red-50" : "text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
  )
}
