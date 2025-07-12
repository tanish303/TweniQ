import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const { globalusername, setglobalusername } = useApp();


  const APIURL = import.meta.env.VITE_API_BASE_URL;

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
                  onClick={() => navigate("/signup")}
                  className="text-purple-600 hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
