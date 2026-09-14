import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Copy, Check, UserCheck, ArrowRight } from "lucide-react";
import Tweniq from "./Tweniq";
import { useApp } from "../context/AppContext"; 

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const { globalusername, setglobalusername } = useApp();

  const APIURL = import.meta.env.VITE_API_BASE_URL;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleAutoFill = () => {
    setFormData({
      email: "thisisademoiddd@gmail.com",
      password: "demo123",
    });
    setShowGuestModal(false);
    toast.info("Guest credentials filled into form!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${APIURL}/signin`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { jwtToken, username } = response.data;

        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("username", username);

        setglobalusername(username);

        toast.success(`Log-in successful as ${username}!`);
        navigate("/pages");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-purple-300 to-indigo-300 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <div className="flex items-center text-in font-bold">
              <span className="text-white mr-2">Welcome to</span>
              <Tweniq />
            </div>
          </div>
        </div>

        {/* Guest Access Modal */}
        {showGuestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowGuestModal(false)}
            ></div>
            {/* Modal Card */}
            <div
              className="relative bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl sm:rounded-2xl
                         shadow-2xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 text-white max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-white/10 hover:bg-white/20
                           rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Modal Header & Message */}
              <div className="pr-6 sm:pr-8 mb-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Guest Access</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Want to see how the site works? Sign in with a demo account without creating your own.
                </p>
              </div>

              {/* Credentials Box */}
              <div className="space-y-3 bg-black/40 border border-white/10 rounded-xl p-3.5 sm:p-4">
                {/* ID */}
                <div className="flex items-center justify-between gap-2 p-2.5 bg-white/5 rounded-lg border border-white/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">id</span>
                    <span className="text-xs sm:text-sm font-mono text-gray-200 truncate block select-all">
                      thisisademoiddd@gmail.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("thisisademoiddd@gmail.com", "id")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      copiedField === "id"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10"
                    }`}
                  >
                    {copiedField === "id" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between gap-2 p-2.5 bg-white/5 rounded-lg border border-white/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">pass</span>
                    <span className="text-xs sm:text-sm font-mono text-gray-200 block select-all">
                      demo123
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("demo123", "pass")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      copiedField === "pass"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10"
                    }`}
                  >
                    {copiedField === "pass" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action button: Auto fill credentials into form */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 cursor-pointer hover:scale-[1.02]"
                >
                  <span>Fill into Sign In Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Sign in to your account</h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/resetpassword")}
                className="text-purple-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-purple-600 hover:underline font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>

            {/* Enter as a guest Button inside the box */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setShowGuestModal(true)}
                className="group w-full py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <div className="w-2.5 h-2.5 bg-emerald-200 rounded-full animate-pulse shadow-sm shadow-emerald-200"></div>
                <span>Enter as a guest</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
