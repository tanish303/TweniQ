import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
 
  Sparkles
} from "lucide-react";

const AppName = import.meta.env.VITE_APP_NAME;
const APIURL = import.meta.env.VITE_API_BASE_URL;
import Tweniq from "./Tweniq";

const Signup = () => {  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlesendotp = async () => {
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }
    setIsValidEmail(true);
    setIsSendingOtp(true);
    try {
      const response = await fetch(`${APIURL}/signup/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleverifyotp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${APIURL}/signup/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        toast.success("Email Verified");
        setTimeout(() => {
          navigate('/setupprofile', { state: { email } });
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "OTP is incorrect.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gradient-to-tl from-pink-200 via-white to-violet-300 flex items-center justify-center p-4">
      <button 
        onClick={() => navigate('/')}
        className="fixed left-6 top-6 z-10 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm 
                   text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 
                   hover:bg-white border border-gray-200 hover:-translate-y-0.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-800 font-semibold flex gap-1">Join <Tweniq/></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-600">Enter your email to get started</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Email Verification</h2>
            <p className="text-sm text-indigo-100">We'll send you a verification code</p>
          </div>

          <form className="p-4 space-y-4"   onSubmit={(e) => e.preventDefault()} 
>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 text-indigo-600" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}

                placeholder="Enter your email"
                className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-lg ${
                  isValidEmail ? "border-gray-300" : "border-red-300 bg-red-50"
                }`}
                required
              />
              {!isValidEmail && <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>}
            </div>

            <button
              type="button"
              onClick={handlesendotp}
              disabled={isSendingOtp}

              className="w-full bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg"
            >
              {isSendingOtp ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
            </button>

            {otpSent && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleverifyotp}
                  disabled={isVerifying}
                  className="w-full bg-green-300 hover:bg-green-400 text-white font-semibold py-3 rounded-lg"
                >
                  {isVerifying ? "Verifying OTP..." : "Verify OTP"}
                </button>
              </>
            )}
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={() => navigate('/signin')}
              className="text-indigo-600 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

      <ToastContainer autoClose={4000} hideProgressBar />
    </div>
  );
};

export default Signup;
