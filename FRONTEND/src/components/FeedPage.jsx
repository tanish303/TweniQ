"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import { MessageCircle, Bookmark, Heart, UserPlus, Check, User, Loader2 } from "lucide-react"
import { useProfile, useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { checkTokenValidity } from "../utils/checkToken"


export default function FeedPage() {
  const { profileMode } = useProfile()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { globalusername } = useApp()
  const navigate = useNavigate()
  const isProfessional = profileMode === "professional"
  const APIURL = import.meta.env.VITE_API_BASE_URL

  const handleSaveToggle = async (postId) => {
      if (!checkTokenValidity()) return; // ❗Redirects and alerts already handled inside the function

    const username = localStorage.getItem("username")
    const mode = profileMode
    console.log(mode)
    if (!username || !mode) {
      console.error("Missing userId or mode")
      return
    }
    try {
      const { data } = await axios.post(`${APIURL}/savepost/toggle-save-post`, {
        username,
        postId,
        mode,
      })
      if (data.success) {
        setPosts((prev) => prev.map((post) => (post.postId === postId ? { ...post, isSaved: data.isSaved } : post)))
      } else {
        console.warn("Failed to toggle save status")
      }
    } catch (err) {
      console.error("Error toggling saved status:", err)
    }
  }

  const handleToggleFollow = async (authorUsername, postId) => {
    if (!checkTokenValidity()) return;

    const currentUsername = localStorage.getItem("username")
    if (!currentUsername) {
      console.error("No username found in localStorage.")
      return
    }
    try {
      const response = await axios.post(`${APIURL}/ff/toggle-follow`, {
        targetUsername: authorUsername,
        currentUsername: currentUsername,
      })
      if (response.status === 200) {
        const updatedPosts = posts.map((post) =>
          post.postId === postId ? { ...post, isFollowing: response.data.isFollowing } : post,
        )
        setPosts(updatedPosts)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    }
  }

  const handleLikeToggle = async (postId) => {
    if (!checkTokenValidity()) return;

    try {
      const username = localStorage.getItem("username")
      const mode = profileMode
      if (!username || !postId || !mode) {
        console.warn("Missing username, postId, or mode")
        return
      }
      const response = await axios.post(`${APIURL}/likeunlike/toggle-like`, {
        postId,
        username,
        mode,
      })
      if (response.status === 200) {
        const { isLiked } = response.data
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId
              ? {
                  ...post,
                  isLiked,
                  numberOfLikes: isLiked ? post.numberOfLikes + 1 : post.numberOfLikes - 1,
                }
              : post,
          ),
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleVote = async (selectedOption, postId) => {
    if (!checkTokenValidity()) return;

    const jwtToken = localStorage.getItem("jwtToken")
    if (!jwtToken) return toast.error("You must be logged in")
    try {
      const response = await fetch(`${APIURL}/poll/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ postId, selectedOption }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast.success("Vote submitted!")
        setPosts((prev) =>
          prev.map((p) => {
            if (p.postId !== postId) return p
            return {
              ...p,
              Poll: {
                ...p.Poll,
                votes: data.votes,
              },
              isVoted: true,
              userVotedOption: selectedOption,
            }
          }),
        )
      } else {
        toast.error(data.message || "Vote failed")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  const handleCommentSection = (postId) => {

    navigate("/commentsection", {
      state: { postId },
    })
  }

  const fetchSocialPosts = async () => {
    if (!checkTokenValidity()) return;

    try {
      setLoading(true)
      const jwtToken = localStorage.getItem("jwtToken")
      if (!jwtToken) {
        alert("You must be logged in to view posts.")
        return
      }
      const response = await fetch(`${APIURL}/fetchposts/fetchsocialposts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setPosts(data.posts)
        console.log(data.posts)
      } else {
        console.error(data.message || "Failed to fetch social posts")
      }
    } catch (err) {
      console.error("Error fetching social posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfessionalPosts = async () => {
    if (!checkTokenValidity()) return;

    try {
      setLoading(true)
      const jwtToken = localStorage.getItem("jwtToken")
      if (!jwtToken) {
        alert("You must be logged in to view posts.")
        return
      }
      const response = await fetch(`${APIURL}/fetchposts/fetchprofessionalposts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setPosts(data.posts)
        console.log(data.posts)
      } else {
        console.error(data.message || "Failed to fetch professional posts")
      }
    } catch (error) {
      console.error("Error fetching professional posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profileMode === "social") {
      fetchSocialPosts()
    } else if (profileMode === "professional") {
      fetchProfessionalPosts()
    }
  }, [profileMode])

  // Loading State
  if (loading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className={`w-8 h-8 border-2 border-t-transparent rounded-full ${
              isProfessional ? "border-blue-600" : "border-purple-600"
            }`}
          >
            <Loader2 className="w-full h-full opacity-0" />
          </motion.div>
          <p className="text-gray-500 text-sm mt-4 font-medium">
            Loading {isProfessional ? "professional" : "social"} posts...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full mb-2 ${
            isProfessional
              ? "bg-slate-100 text-slate-700"
              : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
          }`}
        >
          <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-slate-500" : "bg-purple-500"}`} />
          <span className="text-xs font-medium">Live Feed</span>
        </div>
        <h1
          className={`text-2xl font-bold mb-1 ${
            isProfessional
              ? "text-slate-800"
              : "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          {isProfessional ? "Professional Network" : "Social Circle"}
        </h1>
        <p className="text-gray-600 text-sm">
          {isProfessional
            ? "Stay updated with industry insights and discussions"
            : "Connect with friends and share your moments"}
        </p>
      </motion.div>

      {/* Posts */}
      <div className="space-y-4">
        {posts
          .slice()
          .reverse()
          .map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div
                className={`overflow-hidden transition-all duration-300 hover:shadow-md border-0 rounded-lg ${
                  isProfessional
                    ? "bg-white shadow-sm hover:shadow-slate-200"
                    : "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-purple-200/50"
                }`}
              >
                {/* Post Header - Compact */}
                <div className="p-3 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {/* Profile Picture - Made Bigger */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                          {post.authorDpUrl ? (
                            <img
                              src={`${APIURL}${post.authorDpUrl}`}
                              alt={post.authorUsername}
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
                      </div>

                      {/* User Info - Compact */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Link
                            to={`/showuser/${post.authorUsername}`}
                            className="font-semibold text-gray-900 hover:text-gray-700 transition-colors text-sm"
                          >
                            {post.authorName}
                          </Link>
                          {isProfessional ? (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                              P
                            </span>
                          ) : (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">
                              S
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Link
                            to={`/showuser/${post.authorUsername}`}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            @{post.authorUsername}
                          </Link>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">
                            {new Date(post.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Follow Button - Compact */}
                    <div className="flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleToggleFollow(post.authorUsername, post.postId)}
                        className={`text-xs transition-all duration-200 px-2 py-1 rounded-md font-medium ${
                          post.isFollowing
                            ? isProfessional
                              ? "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                              : "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200"
                            : isProfessional
                              ? "border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400"
                              : "border border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
                        }`}
                      >
                        {post.isFollowing ? (
                          <div className="flex items-center gap-1">
                            <Check className="w-2 h-2" />
                            Following
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <UserPlus className="w-2 h-2" />
                            Follow
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-7 space-y-3 py-4">
                  {/* Post Title */}
                  <h2
                    className={`text-base font-bold leading-tight ${isProfessional ? "text-slate-800" : "text-gray-900"}`}
                  >
                    {post.title}
                  </h2>

                  {/* Post Content */}
                  <p className="text-gray-700 leading-relaxed text-sm">{post.content}</p>

                  {/* Mood Display (Social Mode) */}
                  {!isProfessional && post.mood && (
                    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 rounded-lg border border-purple-200">
                      <span className="text-lg">{post.moodEmoji}</span>
                      <div>
                        <span className="text-purple-700 font-medium text-sm">Feeling {post.mood}</span>
                      </div>
                    </div>
                  )}

                  {/* Tagged Friend Display (Social Mode) */}
                  {!isProfessional && post.taggedFriend && (
                    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 via-green-50 to-cyan-50 rounded-lg border border-green-200">
                      <Link
                        to={`/showuser/${post.taggedFriend}`}
                        className="text-green-700 font-medium text-sm hover:underline"
                      >
                        @{post.taggedFriend}
                      </Link>
                    </div>
                  )}

                  {/* Poll Display (Professional Mode) */}
                  {isProfessional && post.Poll && Array.isArray(post.Poll.options) && post.Poll.options.length > 0 && (
                    <div className="space-y-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        {post.Poll.options.map((option, idx) => {
                          const voteEntry = post.Poll.votes.find((v) => v.option === option)
                          const voteCount = voteEntry?.count || 0
                          const totalVotes = post.Poll.votes.reduce((acc, v) => acc + v.count, 0)
                          const percentage = totalVotes ? (voteCount / totalVotes) * 100 : 0
                          const isUserVote = post.userVotedOption === option
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (!post.isVoted) handleVote(option, post.postId)
                              }}
                              className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
                                post.isVoted
                                  ? isUserVote
                                    ? "bg-blue-600 text-white border border-blue-800 shadow-sm"
                                    : "opacity-70 cursor-not-allowed"
                                  : "cursor-pointer hover:ring-1 hover:ring-blue-300 hover:shadow-sm"
                              }`}
                            >
                              <div
                                className={`flex justify-between items-center p-2 rounded-lg relative z-10 ${
                                  isUserVote ? "bg-blue-600 text-white" : "bg-white border border-blue-200"
                                }`}
                              >
                                <span className="font-medium text-xs">{option}</span>
                                {post.isVoted && (
                                  <div className="text-right">
                                    <span className="font-bold text-xs">{Math.round(percentage)}%</span>
                                    <p className="text-xs opacity-90">{voteCount}</p>
                                  </div>
                                )}
                              </div>
                              {post.isVoted && (
                                <div
                                  className={`absolute left-0 top-0 h-full rounded-lg transition-all duration-500 ${
                                    isUserVote ? "bg-blue-400" : "bg-gradient-to-r from-blue-200 to-indigo-200"
                                  } opacity-40`}
                                  style={{ width: `${percentage}%` }}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {/* Total Votes */}
                      {post.isVoted && (
                        <p className="text-xs text-blue-700 font-medium pt-1 border-t border-blue-200">
                          {post.Poll.votes.reduce((acc, v) => acc + v.count, 0)} total votes
                        </p>
                      )}
                      {/* Footnote */}
                      {!post.isVoted ? (
                        <p className="text-xs text-red-600 font-bold italic pt-2 border-t border-blue-200">
                          * You can only vote once
                        </p>
                      ) : (
                        <p className="text-xs text-green-700 font-bold italic pt-2 border-t border-blue-200">
                          ✓ You have already voted
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons - Compact */}
                <div className="px-3 py-2 mt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLikeToggle(post.postId)}
                        className={`${
                          post.isLiked ? "text-pink-600 bg-pink-50" : "text-gray-500 hover:text-pink-600"
                        } hover:bg-pink-50 px-2 py-1 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium`}
                      >
                        <Heart className="w-3 h-3" fill={post.isLiked ? "currentColor" : "none"} />
                        <span className="text-xs">{post.numberOfLikes}</span>
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => handleCommentSection(post.postId)}
                        className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium ${
                          isProfessional
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        }`}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-xs">{post.numberOfComments}</span>
                      </button>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSaveToggle(post.postId)}
                      className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium ${
                        post.isSaved
                          ? "text-orange-700 bg-orange-100 border border-orange-200"
                          : isProfessional
                            ? "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                            : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      }`}
                    >
                      <Bookmark className="w-3 h-3" fill={post.isSaved ? "currentColor" : "none"} />
                      <span className="text-xs">{post.isSaved ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
      <ToastContainer />
    </div>
  )
}
