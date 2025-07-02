"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  X,
  BarChart3,
  Smile,
  Users,
 
  Sparkles,
} from "lucide-react";
import { useProfile } from "../context/AppContext";
import { useApp } from "../context/AppContext";

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
];

export default function CreatePostPage() {
  const { profileMode } = useProfile();
  const { globalusername } = useApp();

  const [title, setTitle] = useState("");
  
  const [content, setContent] = useState("");
  const [friendexists, setfriendexists] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
    { id: "4", text: "" },
  ]);
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [taggedfriend, settaggedfriend] = useState("");

  const isProfessional = profileMode === "professional";

  const updatePollOption = (id, text) => {
    setPollOptions(
      pollOptions.map((option) =>
        option.id === id ? { ...option, text } : option
      )
    );
  };

const doesfriendexists = async () => {
    if (!taggedfriend.trim()) {
      alert("Please enter a valid username.");
      return;
    }

    try {
      const response = await fetch(`${APIURL}/createpost/checkfriendexists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: taggedfriend }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setfriendexists(true);
      } else {
        setfriendexists(false);
      }
    } catch (error) {
      console.error("Error while checking username existence:", error);
      alert("An error occurred. Please try again later.");
    }
  };

 const handleProfessionalClick = async () => {
  const url = `${APIURL}/createpost/createprofessionalpost`;

  // Preparing the professional post data
  const postData = {
    title,
    content,
    Poll: {
      options: pollOptions.map((option) => option.text).filter((text) => text), // Non-empty options
    },
  };

  try {
    const jwtToken = localStorage.getItem("jwtToken"); // Retrieve JWT token from localStorage

    if (!jwtToken) {
      alert("You must be logged in to create a professional post.");
      return;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`, // Pass JWT token in the Authorization header
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Professional post created successfully!");
      console.log("Created Post:", data.post);
    } else {
      alert(data.message || "Failed to create professional post");
    }
  } catch (error) {
    console.error("Error while creating professional post:", error);
    alert("An error occurred. Please try again later.");
  }
};



const handleSocialClick = async () => {
  const url = `${APIURL}/createpost/createsocialpost`;

  // Preparing the social post data
  const postData = {
    title,
    content,
    mood: selectedMood?.label || "", // Selected mood or an empty string
    moodEmoji: selectedMood?.emoji || "", // Add mood emoji if selected

    taggedFriend: taggedfriend?.trim() || null, // Include tagged friend if provided
  };

  try {
    // Check if a friend is tagged and exists
    if (taggedfriend.trim() && friendexists !== true) {
      alert("Please ensure the tagged friend's username exists.");
      return;
    }

    const jwtToken = localStorage.getItem("jwtToken"); // Retrieve JWT token from localStorage

    if (!jwtToken) {
      alert("You must be logged in to create a post.");
      return;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`, // Pass JWT token in the Authorization header
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Social post created successfully!");
      console.log("Created Post:", data.post);
    } else {
      alert(data.message || "Failed to create social post");
    }
  } catch (error) {
    console.error("Error while creating social post:", error);
    alert("An error occurred. Please try again later.");
  }
};





  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              isProfessional
                ? "bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700"
                : "bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 text-purple-700"
            }`}
          >
            {isProfessional ? (
              <BarChart3 className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span className="font-medium text-sm">
              Create {isProfessional ? "Professional" : "Social"} Content
            </span>
          </div>

          <h1
            className={`text-3xl font-bold mb-3 ${
              isProfessional
                ? "text-slate-800"
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent"
            }`}
          >
            Share Your {isProfessional ? "Expertise" : "Story"}
          </h1>

          <p className="text-gray-600 max-w-lg mx-auto">
            {isProfessional
              ? "Create engaging content and start professional discussions"
              : "Express yourself and connect with your friends"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div
              className={`border-0 shadow-lg rounded-lg ${
                isProfessional
                  ? "bg-white"
                  : "bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm"
              }`}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center gap-2 text-lg font-semibold mb-6">
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

              <div className="px-6 pb-6 space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium block">
                    Post Title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      isProfessional
                        ? "Enter a professional title..."
                        : "What's on your mind?"
                    }
                    className={`w-full h-10 px-3 py-2 border-2 rounded-md transition-all duration-200 ${
                      isProfessional
                        ? "focus:border-blue-500 focus:ring-blue-500/20"
                        : "focus:border-purple-500 focus:ring-purple-500/20"
                    } focus:outline-none focus:ring-2`}
                  />
                </div>

                {/* Content Textarea */}
                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="text-sm font-medium block"
                  >
                    Post Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      isProfessional
                        ? "Share your professional insights..."
                        : "Share what's happening in your life..."
                    }
                    rows={4}
                    className={`w-full px-3 py-2 border-2 rounded-md transition-all duration-200 resize-none ${
                      isProfessional
                        ? "focus:border-blue-500 focus:ring-blue-500/20"
                        : "focus:border-purple-500 focus:ring-purple-500/20"
                    } focus:outline-none focus:ring-2`}
                  />
                </div>

                {/* Professional Mode: Poll Creation */}
                {isProfessional && (
                  <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-blue-900">
                        Create Poll (Optional)
                      </label>
                    </div>

                    <div className="space-y-3">
                      {pollOptions.map((option, index) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-xs">
                            {index + 1}
                          </div>
                          <input
                            value={option.text}
                            onChange={(e) =>
                              updatePollOption(option.id, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 h-9 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center ${
                    isProfessional
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                      : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 shadow-md"
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish Post
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Social Mode: Mood & Friend Tagging */}
            {!isProfessional && (
              <>
                {/* Mood Selection */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-purple-200 shadow-md rounded-lg">
                  <div className="p-4 pb-3">
                    <div className="text-purple-900 flex items-center gap-2 text-sm font-semibold">
                      <Smile className="w-4 h-4" />
                      How are you feeling?
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood.label}
                          onClick={() => setSelectedMood(mood)}
                          className={`flex flex-col items-center gap-1 h-auto py-3 rounded-lg transition-all duration-200 ${
                            selectedMood?.label === mood.label
                              ? "bg-purple-100 text-purple-700 border border-purple-300 shadow-sm"
                              : "hover:bg-white/70"
                          }`}
                        >
                          <span className="text-lg">{mood.emoji}</span>
                          <span className="text-xs font-medium">
                            {mood.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {selectedMood && (
                      <div className="flex items-center gap-2 mt-3 p-2 bg-purple-100 rounded-lg">
                        <span>{selectedMood.emoji}</span>
                        <span className="font-medium text-purple-700 text-sm">
                          Feeling {selectedMood.label}
                        </span>
                        <button
                          onClick={() => setSelectedMood(null)}
                          className="ml-auto text-purple-500 hover:text-purple-700 w-6 h-6 rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Friend Tagging */}
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 shadow-md rounded-lg">
        <div className="p-4 pb-3">
          <div className="text-orange-900 flex items-center gap-2 text-sm font-semibold">
            <Users className="w-4 h-4" />
            Tag a Friend
          </div>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div className="flex gap-2 items-center">
            <input
              value={taggedfriend}
              onChange={(e) => settaggedfriend(e.target.value)}
              placeholder={"Enter friend's username..."}
              className="flex-1 h-8 text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <button
              onClick={doesfriendexists}
              className="px-3 h-8 rounded-md text-white flex items-center justify-center bg-orange-500 hover:bg-orange-600"
            >
              Tag
            </button>
          </div>
          {friendexists === false && (
            <div className="text-red-500 text-sm">Username does not exist.</div>
          )}
           {friendexists === true && (
            <div className="text-green-500 text-sm">Friend tagged succesfully.</div>
          )}
          
        </div>
      </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
