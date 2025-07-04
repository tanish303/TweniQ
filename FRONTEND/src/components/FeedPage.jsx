"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"

import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, Heart, UserPlus, Check,User } from "lucide-react"
import { useProfile ,useApp} from "../context/AppContext"
import { useNavigate } from "react-router-dom";

import { useEffect } from "react"
import axios from 'axios';


 
export default function FeedPage() {
  const { profileMode } = useProfile()
  const [posts, setPosts] = useState([])
    const { globalusername } = useApp();
    const navigate = useNavigate();

  
  const isProfessional = profileMode === "professional"
const APIURL = import.meta.env.VITE_API_BASE_URL


const handleSaveToggle = async (postId) => {
  const username = localStorage.getItem("username");
  const mode = profileMode;
  console.log(mode);
  if (!username || !mode) {
    console.error("Missing userId or mode");
    return;
  }

  try {
    const { data } = await axios.post(`${APIURL}/savepost/toggle-save-post`, {
      username,
      postId,
      mode,
    });

    if (data.success) {
      setPosts((prev) =>
        prev.map((post) =>
          post.postId === postId ? { ...post, isSaved: data.isSaved } : post
        )
      );
    } else {
      console.warn("Failed to toggle save status");
    }
  } catch (err) {
    console.error("Error toggling saved status:", err);
  }
};

const handleToggleFollow = async (authorUsername, postId) => {
  const currentUsername = localStorage.getItem("username"); // Fetch from localStorage

  if (!currentUsername) {
    console.error("No username found in localStorage.");
    return;
  }

  try {
    const response = await axios.post(`${APIURL}/ff/toggle-follow`, {
      targetUsername: authorUsername,
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
       const mode = profileMode;

    if (!username || !postId || !mode) {
      console.warn("Missing username, postId, or mode");
      return;
    }
    const response = await axios.post(`${APIURL}/likeunlike/toggle-like`, {
      postId,
      username,
      mode,
    });

    if (response.status === 200) {
      const { isLiked } = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? {
                ...post,
                isLiked,
                numberOfLikes: isLiked
                  ? post.numberOfLikes + 1
                  : post.numberOfLikes - 1,
              }
            : post
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};


const handleVote = async (selectedOption, postId) => {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) return toast.error("You must be logged in");

  try {
    const response = await fetch(`${APIURL}/poll/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ postId, selectedOption }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("Vote submitted!");

      // Update local UI immediately
      setPosts((prev) =>
        prev.map((p) => {
          if (p.postId !== postId) return p;

          return {
            ...p,
            Poll: {
              ...p.Poll,
              votes: data.votes, // updated votes from backend
            },
            isVoted: true,
            userVotedOption: selectedOption, // ✅ highlight immediately
          };
        })
      );
    } else {
      toast.error(data.message || "Vote failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};



const handleCommentSection = (postId) => {
  console.log("me");
  navigate("/commentsection", {
    state: { postId },
  });
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

const fetchProfessionalPosts = async () => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      alert("You must be logged in to view posts.");
      return;
    }

    const response = await fetch(`${APIURL}/fetchposts/fetchprofessionalposts`, {
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
      console.error(data.message || "Failed to fetch professional posts");
    }
  } catch (error) {
    console.error("Error fetching professional posts:", error);
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
                     <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                            isProfessional
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                              : "bg-gradient-to-r from-pink-500 to-purple-600"
                          }`}
                        >
                          <User className="w-5 h-5 text-white" />
                        </div>
                      
                    </div>
                    <div>
                      <div className="flex gap-2 font-extrabold"  ><h3 className="font-semibold text-gray-900">{post.authorName}</h3> {isProfessional ? (
  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">P</span>
) : (
  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">S</span>
)}
</div>
                      <div className="flex items-center gap-2">
<p className="text-xs text-gray-500">
  {new Date(post.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>                       
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                    onClick={() => handleToggleFollow(post.authorUsername, post.postId)}
                      className={`text-xs transition-all duration-200 px-3 py-1 rounded-md border ${
                        post.isFollowing
                          ? isProfessional
                            ? "bg-slate-300 text-slate-700 border-slate-500"
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
{isProfessional && post.Poll && Array.isArray(post.Poll.options) && post.Poll.options.length > 0 && (
  <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
    <div className="space-y-3">
      {post.Poll.options.map((option, idx) => {
        const voteEntry = post.Poll.votes.find(v => v.option === option);
        const voteCount = voteEntry?.count || 0;
        const totalVotes = post.Poll.votes.reduce((acc, v) => acc + v.count, 0);
        const percentage = totalVotes ? (voteCount / totalVotes) * 100 : 0;
        const isUserVote = post.userVotedOption === option;

        return (
          <div
            key={idx}
            onClick={() => {
              if (!post.isVoted) handleVote(option, post.postId);
            }}
            className={`relative overflow-hidden rounded-lg transition ${
              post.isVoted
                ? isUserVote
                  ? "bg-blue-600 text-white border border-blue-800"
                  : "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:ring hover:ring-blue-300"
            }`}
          >
            <div className={`flex justify-between items-center p-3 rounded-lg relative z-10
              ${isUserVote ? "bg-blue-600 text-white" : "bg-white border border-blue-200"}
            `}>
              <span className="font-medium text-sm">{option}</span>

              {post.isVoted && (
                <div className="text-right">
                  <span className="font-semibold text-sm">
                    {Math.round(percentage)}%
                  </span>
                  <p className="text-xs">{voteCount} votes</p>
                </div>
              )}
            </div>

            {post.isVoted && (
              <div
                className={`absolute left-0 top-0 h-full ${
                  isUserVote
                    ? "bg-blue-400"
                    : "bg-gradient-to-r from-blue-200 to-indigo-200"
                } rounded-lg opacity-30`}
                style={{ width: `${percentage}%` }}
              />
            )}
          </div>
        );
      })}
    </div>

    {/* Total Votes */}
    {post.isVoted && (
      <p className="text-sm text-blue-600 font-medium pt-1">
        {post.Poll.votes.reduce((acc, v) => acc + v.count, 0)} total votes
      </p>
    )}

    {/* Footnote */}
    {!post.isVoted ? (
      <p className="text-sm text-red-600 font-bold italic pt-3">
        * You can only vote once
      </p>
    ) : (
      <p className="text-sm text-green-700 font-bold italic pt-3">
        ✓ You have already voted
      </p>
    )}
  </div>
)}







                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                  
                      <button
  onClick={() => handleLikeToggle(post.postId)}
  className={`${
    post.isLiked ? "text-pink-600" : "text-gray-500"
  } hover:text-pink-700 hover:bg-pink-50 px-3 py-1 rounded-lg flex items-center transition-colors`}
>
  <Heart className="w-4 h-4 mr-1" fill={post.isLiked ? "currentColor" : "none"} />
  <span className="font-medium text-sm">{post.numberOfLikes}</span>
</button>

                    

                    <button onClick={()=> handleCommentSection (post.postId)}
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
  onClick={() => handleSaveToggle(post.postId)}
  className={`px-3 py-1 rounded-lg flex items-center transition-colors ${
    post.isSaved
      ? "text-orange-700 bg-orange-50"          // style when saved
      : isProfessional
          ? "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
  }`}
>
  <Bookmark
    className="w-4 h-4 mr-1"
    fill={post.isSaved ? "currentColor" : "none"}
  />
  <span className="font-medium text-sm">
    {post.isSaved ? "Saved" : "Save"}
  </span>
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
