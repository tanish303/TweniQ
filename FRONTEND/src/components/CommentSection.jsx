"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { ToastContainer, toast } from "react-toastify"
import { motion } from "framer-motion"
import { useProfile } from "../context/AppContext"
import { MessageCircle, Send, User, Clock } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"
import { useLocation } from "react-router-dom"
import { checkTokenValidity } from "../utils/checkToken"; // ✅ Import


const APIURL = import.meta.env.VITE_API_BASE_URL

const CommentSection = () => {
  const { profileMode } = useProfile()
  const mode = profileMode
  const location = useLocation()
  const postId = location.state?.postId
  const [comments, setComments] = useState([])
  const commentRef = useRef()
  const isProfessional = profileMode === "professional"

  /* ───────── Fetch comments ───────── */
  const fetchComments = useCallback(async () => {
    if (!postId) return
    try {
      const res = await fetch(`${APIURL}/comments/getcomments?postId=${postId}&mode=${mode}`)
      const data = await res.json()
      if (res.ok && data.success) {
        setComments(data.comments)
      } else {
        console.error("Failed to fetch comments:", data.message)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }, [postId, mode])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  /* ───────── Add a new comment ────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const comment = commentRef.current.value.trim()
    if (!comment) return toast.warn("Comment cannot be empty")
        if (!checkTokenValidity()) return;
  const jwtToken = localStorage.getItem("jwtToken")

    if (!jwtToken) return toast.error("You must be logged in")

    try {
      const response = await fetch(`${APIURL}/comments/addcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ postId, comment, mode }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast.success("Comment submitted!")
        commentRef.current.value = ""
        fetchComments()
      } else {
        toast.error(data.message || "Failed to submit comment")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  /* ───────── UI ───────── */
  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isProfessional
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
          : "bg-gradient-to-br from-purple-100 via-pink-50  to-yellow-50"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6">
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
            <span className="font-medium text-sm">Discussion</span>
          </div>

          <h1
            className={`text-3xl font-bold mb-3 ${
              isProfessional
                ? "text-slate-800"
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            }`}
          >
            Comments
          </h1>
          <p className="text-gray-600">Join the conversation and share your thoughts</p>
        </motion.div>

        <div className="space-y-6">
          {/* Comments List */}
          {comments.length === 0 ? (
            <motion.div
              className={`text-center py-12 border-0 shadow-lg rounded-lg ${
                isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isProfessional
                    ? "bg-gradient-to-r from-slate-100 to-blue-100"
                    : "bg-gradient-to-r from-pink-100 to-purple-100"
                }`}
              >
                <MessageCircle className={`w-8 h-8 ${isProfessional ? "text-blue-600" : "text-purple-600"}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No comments yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, i) => (
                <motion.div
                  key={i}
                  className={`border-0 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isProfessional
                      ? "bg-white hover:shadow-slate-200"
                      : "bg-white/90 backdrop-blur-sm hover:shadow-purple-200/50"
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden shadow-md">
  {comment.dpUrl ? (
    <img
      src={`${APIURL}${comment.dpUrl}`}           
      alt={comment.displayName}
      className="w-full h-full object-cover object-center"
    />
  ) : (
    <div
      className={`w-full h-full flex items-center justify-center ${
        isProfessional
          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
          : "bg-gradient-to-r from-pink-500 to-purple-600"
      }`}
    >
      <User className="w-5 h-5 text-white" />     
    </div>
  )}
</div>


                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
<div>
  <h4 className="font-semibold text-gray-900">{comment.displayName}</h4>
  {comment.username && (
    <a
      href={`/showuser/${comment.username}`}
      className="text-xs text-blue-600 hover:underline block"
    >
      @{comment.username}
    </a>
  )}
</div>
                          {isProfessional && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Pro</span>
                          )}
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-3">{comment.text}</p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <motion.div
            className={`border-0 shadow-lg rounded-lg ${
              isProfessional ? "bg-white" : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-6">
                <div
                  className={`p-2 rounded-lg ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-pink-400 to-purple-400"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                Add a Comment
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Your Comment</label>
                <textarea
                  ref={commentRef}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-none focus:outline-none focus:ring-2 ${
                    isProfessional
                      ? "focus:border-blue-500 focus:ring-blue-500/20 border-gray-200"
                      : "focus:border-purple-500 focus:ring-purple-500/20 border-gray-200"
                  }`}
                  rows="4"
                  placeholder={
                    isProfessional
                      ? "Share your professional insights..."
                      : "Share your thoughts and join the conversation..."
                  }
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center shadow-md text-white ${
                  isProfessional
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700"
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      

      <ToastContainer />
    </div>
  )
}

export default CommentSection
