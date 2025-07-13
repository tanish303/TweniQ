"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowLeft, FileText, Briefcase, Heart, User, UserPlus, Sparkles, Calendar, Check } from "lucide-react"
import { checkTokenValidity } from "../utils/checkToken"

const APIURL = import.meta.env.VITE_API_BASE_URL

export default function GlobalProfilepage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)

  const handleToggleFollow = async () => {
    if (!checkTokenValidity()) return
    const token = localStorage.getItem("jwtToken")
    if (!token) return alert("You must be logged in to follow users.")

    try {
      setIsFollowing((prev) => !prev)
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1))
      await axios.post(
        `${APIURL}/showuser/follow/${username}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    } catch (err) {
      alert("Something went wrong. Please contact the support team.")
      setIsFollowing((prev) => !prev)
      setFollowerCount((prev) => (isFollowing ? prev + 1 : prev - 1))
    }
  }

  useEffect(() => {
    if (!checkTokenValidity()) return
    ;(async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("jwtToken")
        const { data } = await axios.get(`${APIURL}/showuser/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData(data)
        setIsFollowing(data.isFollow || false)
        setFollowerCount(data.followers || 0)
      } catch (err) {
        setError("Failed to load profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    })()
  }, [username])

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-sm w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"
          />
          <p className="text-gray-700 text-sm font-medium">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-sm w-full"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600 text-sm mb-4">{error || "User doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-md text-sm"
          >
            <ArrowLeft className="w-3 h-3" />
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  const {
    username: uname,
    professionalName,
    professionalBio,
    occupation,
    professionalDpUrl,
    professionalPosts,
    socialName,
    socialBio,
    hobbies,
    socialDpUrl,
    socialPosts,
    followers,
    following,
    joinedDate,
  } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 md:p-4 pb-6 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-3 md:mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-200 bg-white/70 backdrop-blur-sm px-3 py-2 md:py-1.5 rounded-lg shadow-md hover:shadow-lg w-fit text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 md:w-3 md:h-3" />
          <span className="font-medium">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 px-4 py-4 md:py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <User className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-lg font-bold text-white">@{uname}</h1>
                  <div className="flex items-center gap-1 text-sm md:text-xs text-purple-100">
                    <Calendar className="w-4 h-4 md:w-3 md:h-3" />
                    <span>
                      Joined{" "}
                      {new Date(joinedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats & Follow */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-4 md:gap-3 text-white text-sm md:text-xs">
                  <div className="text-center">
                    <div className="font-bold text-lg md:text-base">{followerCount}</div>
                    <div className="opacity-80 text-xs">Followers</div>
                  </div>
                  <div className="w-px h-8 md:h-6 bg-white/30"></div>
                  <div className="text-center">
                    <div className="font-bold text-lg md:text-base">{following}</div>
                    <div className="opacity-80 text-xs">Following</div>
                  </div>
                </div>
                <motion.button
                  onClick={handleToggleFollow}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 md:px-3 md:py-1.5 rounded-lg text-sm md:text-xs font-semibold transition-all duration-200 shadow-md flex items-center gap-2 md:gap-1 ${
                    isFollowing
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-white text-purple-600 hover:bg-gray-100"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-4 h-4 md:w-3 md:h-3" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 md:w-3 md:h-3" />
                      Follow
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-4 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Social Profile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200/50 p-4 md:p-3"
            >
              {/* Social Header */}
              <div className="flex items-center gap-2 mb-4 md:mb-3 pb-3 md:pb-2 border-b border-pink-200/50">
                <div className="p-1.5 md:p-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-md">
                  <Heart className="w-4 h-4 md:w-3 md:h-3 text-white" />
                </div>
                <h2 className="text-base md:text-sm font-bold text-gray-900">Social Profile</h2>
              </div>

              {/* Social Content */}
              <div className="space-y-4 md:space-y-3">
                <div className="flex items-start gap-4 md:gap-3">
                  {/* Social DP */}
                  <div className="relative flex-shrink-0">
                    {socialDpUrl ? (
                      <img
                        src={`${socialDpUrl}`}
                        alt="Social DP"
                        className="h-14 w-14 md:h-10 md:w-10 rounded-lg object-cover shadow-sm ring-2 ring-pink-200/50"
                      />
                    ) : (
                      <div className="h-14 w-14 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center ring-2 ring-pink-200/50 shadow-sm">
                        <User className="h-6 w-6 md:h-4 md:w-4 text-pink-500" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-1 md:p-0.5">
                      <Heart className="w-3 h-3 md:w-2 md:h-2 text-white" />
                    </div>
                  </div>

                  {/* Social Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-sm font-bold text-gray-900 mb-2 md:mb-1">{socialName}</h3>
                    <div className="flex items-center gap-2 text-sm md:text-xs">
                      <div className="flex items-center gap-1 bg-white/70 rounded px-3 py-2 md:px-2 md:py-1">
                        <FileText className="w-4 h-4 md:w-3 md:h-3 text-pink-600" />
                        <span className="font-bold text-gray-900">{socialPosts}</span>
                        <span className="text-gray-600">posts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Bio */}
                <div className="bg-white/70 rounded-lg p-3 md:p-2">
                  <p className="text-sm md:text-xs text-gray-700 leading-relaxed">
                    {socialBio || "No bio available ✨"}
                  </p>
                </div>

                {/* Hobbies */}
                {hobbies && hobbies.length > 0 && (
                  <div className="flex items-center gap-2 md:gap-1 bg-white/70 rounded-lg px-3 py-2 md:px-2 md:py-1">
                    <Sparkles className="w-4 h-4 md:w-3 md:h-3 text-purple-600 flex-shrink-0" />
                    <span className="text-sm md:text-xs text-gray-700 font-medium truncate">{hobbies.join(", ")}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Professional Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 p-4 md:p-3"
            >
              {/* Professional Header */}
              <div className="flex items-center gap-2 mb-4 md:mb-3 pb-3 md:pb-2 border-b border-blue-200/50">
                <div className="p-1.5 md:p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md">
                  <Briefcase className="w-4 h-4 md:w-3 md:h-3 text-white" />
                </div>
                <h2 className="text-base md:text-sm font-bold text-gray-900">Professional Profile</h2>
              </div>

              {/* Professional Content */}
              <div className="space-y-4 md:space-y-3">
                <div className="flex items-start gap-4 md:gap-3">
                  {/* Professional DP */}
                  <div className="relative flex-shrink-0">
                    {professionalDpUrl ? (
                      <img
                        src={`${professionalDpUrl}`}
                        alt="Professional DP"
                        className="h-14 w-14 md:h-10 md:w-10 rounded-lg object-cover shadow-sm ring-2 ring-blue-200/50"
                      />
                    ) : (
                      <div className="h-14 w-14 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center ring-2 ring-blue-200/50 shadow-sm">
                        <User className="h-6 w-6 md:h-4 md:w-4 text-blue-500" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-1 md:p-0.5">
                      <Briefcase className="w-3 h-3 md:w-2 md:h-2 text-white" />
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-sm font-bold text-gray-900 mb-2 md:mb-1">{professionalName}</h3>
                    <div className="flex items-center gap-2 text-sm md:text-xs">
                      <div className="flex items-center gap-1 bg-white/70 rounded px-3 py-2 md:px-2 md:py-1">
                        <FileText className="w-4 h-4 md:w-3 md:h-3 text-blue-600" />
                        <span className="font-bold text-gray-900">{professionalPosts}</span>
                        <span className="text-gray-600">posts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="bg-white/70 rounded-lg p-3 md:p-2">
                  <p className="text-sm md:text-xs text-gray-700 leading-relaxed">
                    {professionalBio || "No professional bio available 🚀"}
                  </p>
                </div>

                {/* Occupation */}
                {occupation && (
                  <div className="flex items-center gap-2 md:gap-1 bg-white/70 rounded-lg px-3 py-2 md:px-2 md:py-1">
                    <Briefcase className="w-4 h-4 md:w-3 md:h-3 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm md:text-xs text-gray-700 font-medium capitalize truncate">
                      {occupation.replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
