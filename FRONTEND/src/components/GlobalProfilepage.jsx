"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Users, FileText, Briefcase, Heart, User, UserPlus, Sparkles } from "lucide-react"

const APIURL = import.meta.env.VITE_API_BASE_URL

export default function GlobalProfilepage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
    const [isFollowing, setIsFollowing] = useState(false);
      const [followerCount, setFollowerCount] = useState(0);



 const handleToggleFollow = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("You must be logged in to follow users.");

    try {
      // Optimistic UI update
      setIsFollowing((prev) => !prev);
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));


      await axios.post(
        `${APIURL}/showuser/follow/${username}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error toggling follow:", err);
      // Revert on failure
      setIsFollowing((prev) => !prev);
            setFollowerCount((prev) => (isFollowing ? prev + 1 : prev - 1));

    }
  };


 useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwtToken");

        const { data } = await axios.get(`${APIURL}/showuser/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(data);
        setIsFollowing(data.isFollow || false);
        setFollowerCount(data.followers || 0);

      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

console.log(data);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex flex-col items-center justify-center space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-red-500 font-medium mb-3">{error || "User not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </motion.button>

        <div className="max-w-2xl mx-auto">
          {/* Username and Stats Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold mb-1">@{uname}</h1>
<p className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-3">
  <span className="text-gray-400">Joined</span>
  {new Date(joinedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })}
</p>


            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-900">{followerCount}</span>
                <span className="text-gray-600">followers</span>
              </div>
              <div className="flex items-center gap-1">
                <UserPlus className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-900">{following}</span>
                <span className="text-gray-600">following</span>
              </div>
            </div>

            {/* Follow Button */}
            <button onClick={handleToggleFollow} className={`px-4 py-1.5 text-sm rounded-full transition-all ${isFollowing ? "bg-gray-300 text-gray-800 hover:bg-gray-400" : "bg-purple-600 text-white hover:bg-purple-700"}`}>
              {isFollowing ? "Following" : "Follow"}
            </button>
          </motion.div>

          {/* Single Combined Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Social Section */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Social Profile</h2>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="flex items-start gap-4 mb-4">
                {/* Social Profile Picture */}
                <div className="relative flex-shrink-0">
  {socialDpUrl ? (
    <img
      src={`${APIURL}${socialDpUrl}`}
      alt="Social DP"
      className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-pink-200"
    />
  ) : (
    <div className="h-14 w-14 rounded-full bg-pink-100 flex items-center justify-center ring-2 ring-pink-200 shadow-md">
      <User className="h-6 w-6 text-gray-500" />
    </div>
  )}
  <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5">
    <Heart className="w-3 h-3 text-white" />
  </div>
</div>


                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{socialName}</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Bio:-</span> {socialBio || "No bio available"}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-pink-600" />
                      <span className="font-semibold">{socialPosts}</span>
                      <span className="text-gray-600">posts</span>
                    </div>
                    {hobbies && hobbies.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-pink-600" />
                        <span className="text-gray-600 text-xs">{hobbies.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Section */}
            <div className="bg-gradient-to-r from-blue-300 to-indigo-400 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Professional Profile</h2>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4 mb-4">
                {/* Professional Profile Picture */}
                <div className="relative flex-shrink-0">
  {professionalDpUrl ? (
    <img
      src={`${APIURL}${professionalDpUrl}`}
      alt="Professional DP"
      className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-blue-200"
    />
  ) : (
    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-blue-200 shadow-md">
      <User className="h-6 w-6 text-gray-500" />
    </div>
  )}
  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
    <Briefcase className="w-3 h-3 text-white" />
  </div>
</div>


                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{professionalName}</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Bio:-</span> {professionalBio || "No bio available"}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span className="font-semibold">{professionalPosts}</span>
                      <span className="text-gray-600">posts</span>
                    </div>
                    {occupation && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-blue-600" />
                        <span className="text-gray-600 text-xs">{occupation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
