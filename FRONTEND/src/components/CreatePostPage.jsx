"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, X, BarChart3, Smile, Users, Sparkles } from "lucide-react"
import { useProfile } from "../context/AppContext"
import { useApp } from "../context/AppContext"
import { checkTokenValidity } from "../utils/checkToken"; // ✅ Already done in other components
import { useNavigate } from "react-router-dom"


const APIURL = import.meta.env.VITE_API_BASE_URL

const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😎", label: "Cool" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "🎉", label: "Excited" },
  { emoji: "😴", label: "Sleepy" },
  { emoji: "🏔️", label: "Adventurous" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "🌟", label: "Inspired" },
]

export default function CreatePostPage() {
  const { profileMode } = useProfile()
  const { globalusername } = useApp()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [friendexists, setfriendexists] = useState("")
  const navigate = useNavigate();

  const [pollOptions, setPollOptions] = useState([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
    { id: "4", text: "" },
  ])
  const [selectedMood, setSelectedMood] = useState(null)
  const [taggedfriend, settaggedfriend] = useState("")

  const isProfessional = profileMode === "professional"

  const updatePollOption = (id, text) => {
    setPollOptions(pollOptions.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  const doesfriendexists = async () => {
    if (!taggedfriend.trim()) {
      alert("Please enter a valid username.")
      return
    }
    try {
      const response = await fetch(`${APIURL}/createpost/checkfriendexists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: taggedfriend }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setfriendexists(true)
      } else {
        setfriendexists(false)
      }
    } catch (error) {
      console.error("Error while checking username existence:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  const handleProfessionalClick = async () => {
    const url = `${APIURL}/createpost/createprofessionalpost`
    const postData = {
      title,
      content,
      Poll: {
        options: pollOptions.map((option) => option.text).filter((text) => text),
      },
    }
      if (!checkTokenValidity()) return;

    try {
      const jwtToken = localStorage.getItem("jwtToken")
      if (!jwtToken) {
        alert("You must be logged in to create a professional post.")
        return
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(postData),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        alert("Professional post created successfully!")
        console.log("Created Post:", data.post)
        setTitle("")
        setContent("")
        setPollOptions([
          { id: "1", text: "" },
          { id: "2", text: "" },
          { id: "3", text: "" },
          { id: "4", text: "" },
          
        ])
        navigate("/pages/feed");

      } else {
        alert(data.message || "Failed to create professional post")
      }
    } catch (error) {
      console.error("Error while creating professional post:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  const handleSocialClick = async () => {
    const url = `${APIURL}/createpost/createsocialpost`
    const postData = {
      title,
      content,
      mood: selectedMood?.label || "",
      moodEmoji: selectedMood?.emoji || "",
      taggedFriend: taggedfriend?.trim() || null,
    }
      if (!checkTokenValidity()) return;

    try {
      if (taggedfriend.trim() && friendexists !== true) {
        alert("Please ensure the tagged friend's username exists.")
        return
      }
      const jwtToken = localStorage.getItem("jwtToken")
      if (!jwtToken) {
        alert("You must be logged in to create a post.")
        return
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(postData),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        alert("Social post created successfully!")
        console.log("Created Post:", data.post)
        setTitle("")
        setContent("")
        setSelectedMood(null)
        settaggedfriend("")
        setfriendexists(null)
        navigate("/pages/feed")
      } else {
        alert(data.message || "Failed to create social post")
      }
    } catch (error) {
      console.error("Error while creating social post:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-3">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 ${
              isProfessional
                ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
                : "bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 text-purple-700"
            }`}
          >
            {isProfessional ? <BarChart3 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            <span className="font-medium text-xs">Create {isProfessional ? "Professional" : "Social"} Content</span>
          </div>
          <h1
            className={`text-2xl font-bold mb-2 ${
              isProfessional
                ? "text-slate-800"
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent"
            }`}
          >
            Share Your {isProfessional ? "Expertise" : "Story"}
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            {isProfessional
              ? "Create engaging content and start professional discussions"
              : "Express yourself and connect with your friends"}
          </p>
        </div>

        {/* Content Layout */}
        <div className={`${isProfessional ? "flex justify-center" : "grid lg:grid-cols-3 gap-6"}`}>
          {/* Main Form */}
          <div className={isProfessional ? "w-full max-w-xl" : "lg:col-span-2"}>
            <div
              className={`border-0 shadow-md rounded-lg ${
                isProfessional ? "bg-white" : "bg-gradient-to-br from-white/95 to-purple-50/80 backdrop-blur-sm"
              }`}
            >
              <div className="p-4 pb-3">
                <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                  {isProfessional ? (
                    <>
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      Professional Post
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                        <Smile className="w-4 h-4 text-white" />
                      </div>
                      Social Post
                    </>
                  )}
                </div>
              </div>

              <div className="px-4 pb-4 space-y-4">
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-xs font-semibold text-gray-700 block">
                    Post Title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={isProfessional ? "Enter a professional title..." : "What's on your mind?"}
                    className={`w-full h-9 px-3 py-2 border-2 rounded-lg transition-all duration-200 text-sm ${
                      isProfessional
                        ? "focus:border-blue-500 focus:ring-blue-500/20"
                        : "focus:border-purple-500 focus:ring-purple-500/20"
                    } focus:outline-none focus:ring-2 shadow-sm hover:shadow-md`}
                  />
                </div>

                {/* Content Textarea */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-xs font-semibold text-gray-700 block">
                    Post Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      isProfessional ? "Share your professional insights..." : "Share what's happening in your life..."
                    }
                    rows={4}
                    className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 resize-none text-sm ${
                      isProfessional
                        ? "focus:border-blue-500 focus:ring-blue-500/20"
                        : "focus:border-purple-500 focus:ring-purple-500/20"
                    } focus:outline-none focus:ring-2 shadow-sm hover:shadow-md`}
                  />
                </div>

                {/* Professional Mode: Poll Creation */}
                {isProfessional && (
                  <div className="space-y-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-blue-900">Create Poll (Optional)</label>
                    </div>
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">
                            {index + 1}
                          </div>
                          <input
                            value={option.text}
                            onChange={(e) => updatePollOption(option.id, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 h-8 px-2 py-1 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={isProfessional ? handleProfessionalClick : handleSocialClick}
                  disabled={!title.trim() || !content.trim()}
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center text-sm ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                      : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish Post
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Only for Social Mode */}
          {!isProfessional && (
            <div className="space-y-4">
              {/* Mood Selection */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-purple-200 shadow-md rounded-lg">
                <div className="p-3 pb-2">
                  <div className="text-purple-900 flex items-center gap-2 text-xs font-semibold">
                    <Smile className="w-3 h-3" />
                    How are you feeling?
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <div className="grid grid-cols-2 gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => setSelectedMood(mood)}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-200 ${
                          selectedMood?.label === mood.label
                            ? "bg-purple-100 text-purple-700 border-2 border-purple-300 shadow-sm transform scale-105"
                            : "hover:bg-white/70 border-2 border-transparent"
                        }`}
                      >
                        <span className="text-base">{mood.emoji}</span>
                        <span className="text-xs font-medium">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                  {selectedMood && (
                    <div className="flex items-center gap-2 mt-3 p-2 bg-purple-100 rounded-lg">
                      <span className="text-sm">{selectedMood.emoji}</span>
                      <span className="font-semibold text-purple-700 text-xs">Feeling {selectedMood.label}</span>
                      <button
                        onClick={() => setSelectedMood(null)}
                        className="ml-auto text-purple-500 hover:text-purple-700 w-5 h-5 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Friend Tagging - Redesigned */}
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 shadow-md rounded-lg">
                <div className="p-3 pb-2">
                  <div className="text-orange-900 flex items-center gap-2 text-xs font-semibold">
                    <Users className="w-3 h-3" />
                    Tag a Friend
                  </div>
                </div>
                <div className="px-3 pb-3 space-y-3">
                  <div className="space-y-2">
                    <input
                      value={taggedfriend}
                      onChange={(e) => settaggedfriend(e.target.value)}
                      placeholder="Enter friend's username..."
                      className="w-full h-8 text-xs px-3 py-1 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                    />
                    <button
                      onClick={doesfriendexists}
                      className="w-full px-3 py-2 rounded-lg text-white font-medium text-xs bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      Check & Tag Friend
                    </button>
                  </div>

                  {friendexists === false && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <X className="w-3 h-3 text-red-500" />
                      <span className="text-red-600 text-xs font-medium">Username does not exist.</span>
                    </div>
                  )}

                  {friendexists === true && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <Users className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 text-xs font-medium">Friend tagged successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
