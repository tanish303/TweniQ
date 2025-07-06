"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { io } from "socket.io-client"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useProfile } from "../context/AppContext"
import { ArrowLeft, Send, User, Clock, Calendar } from "lucide-react"

const API = import.meta.env.VITE_API_BASE_URL

const socket = io(API, {
  auth: { token: localStorage.getItem("jwtToken") },
})

// 🕒 Format time like 3:45 PM
function formatTime(iso) {
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// 📅 Format date line like Today / Yesterday / July 5, 2025
function formatDateHeader(iso) {
  const today = new Date()
  const msgDate = new Date(iso)

  const isToday = today.toDateString() === msgDate.toDateString()
  const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === msgDate.toDateString()

  if (isToday) return "Today"
  if (isYesterday) return "Yesterday"
  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ChatWindow() {
  const { roomId } = useParams()
  const { profileMode } = useProfile()
  const navigate = useNavigate()

  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState("")
  const [partnerUsername, setPartnerUsername] = useState("Partner")
  const isProfessional = profileMode === "professional"

  const myId = useMemo(() => {
    try {
      const token = localStorage.getItem("jwtToken")
      return token ? jwtDecode(token).userId : null
    } catch {
      return null
    }
  }, [])

  // Fetch partner username once
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`${API}/chat/room/${roomId}/info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        setPartnerUsername(data.partnerUsername)
      } catch (err) {
        console.error("Couldn't fetch partner username", err)
      }
    })()
  }, [roomId])

  // Fetch message history
  useEffect(() => {
    axios
      .get(`${API}/chat/room/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((res) => {
        setMsgs(res.data.messages)
        console.log("Fetched messages:", res.data.messages) // 👈 Log after fetching
      })
      .catch((err) => console.error(err))
  }, [roomId])

  // Real-time listener
  useEffect(() => {
    const listener = (m) => {
      if (m.room === roomId) setMsgs((prev) => [...prev, m])
    }
    socket.on("chat:receive", listener)
    return () => socket.off("chat:receive", listener)
  }, [roomId])

  const send = () => {
    if (!text.trim()) return
    socket.emit("chat:send", { roomId, text })
    setText("")
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isProfessional
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
          : "bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50"
      }`}
    >
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className={`border-0 shadow-lg ${
            isProfessional ? "bg-white" : "bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isProfessional
                    ? "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    : "text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-pink-500 to-purple-600"
                  }`}
                >
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{partnerUsername}</h2>
                  <div className="flex items-center gap-1">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
<div
  className={`flex-1 overflow-hidden border-2 ${
    profileMode === "social" ? "border-pink-100" : "border-blue-100"
  }`}
>          <div className="h-full overflow-y-auto p-6 space-y-4">
            {msgs.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isProfessional
                      ? "bg-gradient-to-r from-slate-100 to-blue-100"
                      : "bg-gradient-to-r from-pink-100 to-purple-100"
                  }`}
                >
                  <User className={`w-8 h-8 ${isProfessional ? "text-blue-600" : "text-purple-600"}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Start the conversation</h3>
                <p className="text-gray-500">Send a message to {partnerUsername}</p>
              </motion.div>
            ) : (
              msgs.map((m, idx) => {
                const isMe = m.sender?.toString() === myId?.toString()
                const showDateLine =
                  idx === 0 ||
                  new Date(m.createdAt).toDateString() !== new Date(msgs[idx - 1]?.createdAt).toDateString()

                return (
                  <motion.div
                    key={m._id}
                    className="flex flex-col space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    {showDateLine && (
                      <div className="flex items-center justify-center my-4">
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            isProfessional ? "bg-slate-100 text-slate-600" : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDateHeader(m.createdAt)}
                        </div>
                      </div>
                    )}

                    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-medium ${
                              isMe ? (isProfessional ? "text-blue-600" : "text-purple-600") : "text-gray-600"
                            }`}
                          >
                            {isMe ? "You" : partnerUsername}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">{formatTime(m.createdAt)}</span>
                          </div>
                        </div>

                        <div
                          className={`relative px-4 py-3 rounded-2xl shadow-sm max-w-full break-words ${
                            isMe
                              ? isProfessional
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{m.text}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Input Section */}
        <motion.div
          className={`border-0 shadow-lg ${
            isProfessional ? "bg-white" : "bg-gradient-to-r from-white/90 to-purple-50/50 backdrop-blur-sm"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6">
            <div className="flex gap-3">
              <input
                className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                  isProfessional
                    ? "focus:border-blue-500 focus:ring-blue-500/20 border-gray-200"
                    : "focus:border-purple-500 focus:ring-purple-500/20 border-gray-200"
                }`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Message ${partnerUsername}...`}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  isProfessional
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
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
