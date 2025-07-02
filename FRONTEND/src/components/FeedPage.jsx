"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, Heart, UserPlus, Check } from "lucide-react"
import { useProfile ,useApp} from "../context/AppContext"
import { useEffect } from "react"
import axios from 'axios';


 
export default function FeedPage() {
  const { profileMode } = useProfile()
  const [posts, setPosts] = useState([])
    const { globalusername } = useApp();
  
  const isProfessional = profileMode === "professional"
const APIURL = import.meta.env.VITE_API_BASE_URL

  const handleVote = (postId, type) => {
   
  }

  const handleSave = (postId) => {
    
  }

const handleToggleFollow = async (authorName, postId, posts, setPosts) => {
  const currentUsername = localStorage.getItem("username"); // Fetch from localStorage

  if (!currentUsername) {
    console.error("No username found in localStorage.");
    return;
  }

  try {
    const response = await axios.post(`${APIURL}/ff/toggle-follow`, {
      targetUsername: authorName,
      currentUsername: currentUsername,
    });

    if (response.status === 200) {
      const updatedPosts = posts.map((post) =>
        post.postId === postId ? { ...post, isFollowing: response.data.isFollowing } : post
      );
      setPosts(updatedPosts);
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
};


const handleLikeToggle = async (postId) => {
  try {
    const username = localStorage.getItem("username");
    const response = await axios.post(`${APIURL}/likeunlike/toggle-like`, {
      postId,
      username,
    });

    if (response.status === 200) {
      const { isLiked } = response.data;

      // Update the UI state (assuming you have posts stored in state)
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? {
                ...post,
                isLiked,
                numberOfLikes: isLiked ? post.numberOfLikes + 1 : post.numberOfLikes - 1,
              }
            : post
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};


   const fetchSocialPosts = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
        alert("You must be logged in to view posts.");
        return;
      }

      const response = await fetch(`${APIURL}/fetchposts/fetchsocialposts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPosts(data.posts);
        console.log(data.posts);
      } else {
        console.error(data.message || "Failed to fetch social posts");
      }
    } catch (err) {
      console.error("Error fetching social posts:", err);
    } 
  };

 useEffect(() => {
   

    if (profileMode === "social") {
      fetchSocialPosts();
    } else if (profileMode === "professional") {
      fetchProfessionalPosts();
    }
  }, [profileMode]);

  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 ${
            isProfessional
              ? "bg-slate-100 text-slate-700"
              : "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700"
          }`}
        >
          <div className={`w-1 h-1 rounded-full ${isProfessional ? "bg-slate-500" : "bg-purple-500"}`} />
          <span className="text-xs font-medium">Live Feed</span>
        </div>

        <h1
          className={`text-3xl font-bold mb-2 ${
            isProfessional
              ? "text-slate-800"
              : "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          {isProfessional ? "Professional Network" : "Social Circle"}
        </h1>
        <p className="text-gray-600">
          {isProfessional
            ? "Stay updated with industry insights and discussions"
            : "Connect with friends and share your moments"}
        </p>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.slice().reverse().map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-0 rounded-lg ${
                isProfessional
                  ? "bg-white shadow-md hover:shadow-slate-200"
                  : "bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-purple-200/50"
              }`}
            >
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                        <img
                          src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
                          alt={post.authorName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          isProfessional ? "bg-green-500" : "bg-pink-500"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                      <div className="flex items-center gap-2">
<p className="text-xs text-gray-500">
  {new Date(post.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>                        {isProfessional && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Pro</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                    onClick={() => handleToggleFollow(post.authorName, post.postId, posts, setPosts)}
                      className={`text-xs transition-all duration-200 px-3 py-1 rounded-md border ${
                        post.isFollowing
                          ? isProfessional
                            ? "bg-slate-100 text-slate-700 border-slate-300"
                            : "bg-purple-100 text-purple-700 border-purple-300"
                          : isProfessional
                            ? "border-slate-300 text-slate-600 hover:bg-slate-50"
                            : "border-purple-300 text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      {post.isFollowing ? (
                        <div className="flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Following
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UserPlus className="w-3 h-3 mr-1" />
                          Follow
                        </div>
                      )}
                    </button>

                    
                  </div>
                </div>
              </div>

              <div className="px-4 space-y-4">
                {/* Post Title */}
                <h2 className={`text-lg font-semibold ${isProfessional ? "text-slate-800" : "text-gray-900"}`}>
                  {post.title}
                </h2>

                {/* Post Content */}
                <p className="text-gray-700 leading-relaxed">{post.content}</p>

                {/* Mood Display (Social Mode) */}
                {!isProfessional && post.mood && (
  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 rounded-lg border border-purple-100">
    <span className="text-2xl">{post.moodEmoji}</span>
    <div>
      <span className="text-purple-700 font-medium">Feeling {post.mood}</span>
    </div>
  </div>
)}
{!isProfessional && post.taggedFriend && (
  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 via-green-50 to-cyan-50 rounded-lg border border-green-100">
    <span className="text-green-700 font-medium">
      @ <span className="font-semibold">{post.taggedFriend}</span>
    </span>
  </div>
)}

                {/* Poll Display (Professional Mode) */}
                {post.type === "poll" && post.poll && isProfessional && (
                  <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-900">{post.poll.question}</h4>
                    <div className="space-y-2">
                      {post.poll.options.map((option, idx) => {
                        const percentage = (option.votes / post.poll.totalVotes) * 100
                        return (
                          <div key={idx} className="relative overflow-hidden">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-200 relative z-10">
                              <span className="font-medium text-sm">{option.text}</span>
                              <div className="text-right">
                                <span className="text-blue-700 font-semibold text-sm">{Math.round(percentage)}%</span>
                                <p className="text-xs text-gray-500">{option.votes} votes</p>
                              </div>
                            </div>
                            <div
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg opacity-30"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-blue-600 font-medium">{post.poll.totalVotes} total votes</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    {isProfessional ? (
                      <>
                        <button
                          onClick={() => handleVote(post.id, "upvote")}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 rounded-lg flex items-center transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="font-medium text-sm">{post.stats.upvotes}</span>
                        </button>
                        <button
                          onClick={() => handleVote(post.id, "downvote")}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg flex items-center transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          <span className="font-medium text-sm">{post.stats.downvotes}</span>
                        </button>
                      </>
                    ) : (
                      <button
  onClick={() => handleLikeToggle(post.postId)}
  className={`${
    post.isLiked ? "text-pink-600" : "text-gray-500"
  } hover:text-pink-700 hover:bg-pink-50 px-3 py-1 rounded-lg flex items-center transition-colors`}
>
  <Heart className="w-4 h-4 mr-1" fill={post.isLiked ? "currentColor" : "none"} />
  <span className="font-medium text-sm">{post.numberOfLikes}</span>
</button>

                    )}

                    <button
                      className={`px-3 py-1 rounded-lg flex items-center transition-colors ${
                        isProfessional
                          ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="font-medium text-sm">{
post.numberOfComments
}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSave(post.id)}
                    className={`px-3 py-1 rounded-lg flex items-center transition-colors ${
                      isProfessional
                        ? "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    }`}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    <span className="font-medium text-sm">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      
    </div>
  )
}
