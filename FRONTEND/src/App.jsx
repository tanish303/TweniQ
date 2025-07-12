import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// pages/components
import Landingpage from "./components/Landingpage";
import Signup from "./components/Signup";
import Setupprofile from "./components/Setupprofile";
import Signin from "./components/Signin";
import ResetPassword from "./components/ResetPasswords";
import Pages from "./Pages";
import HomePage from "./components/HomePage";
import FeedPage from "./components/FeedPage";
import CreatePostPage from "./components/CreatePostPage";
import AccountPage from "./components/AccountPage";
import CommentSection from "./components/CommentSection";
import ViewPersonalStats from "./components/ViewPersonalStats";
import ChatPage from "./components/ChatPage";
import ChatWindow from "./components/ChatWindow";
import GlobalProfilepage from "./components/GlobalProfilepage";

import ProtectedRoute from "./components/ProtectedRoute";   // 👈 NEW
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/setupprofile" element={  <Setupprofile />} />

          {/* ---------- Protected Stand‑Alone Routes ---------- */}
     
          <Route
            path="/commentsection"
            element={
              <ProtectedRoute>
                <CommentSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/:category"
            element={
              <ProtectedRoute>
                <ViewPersonalStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:roomId"
            element={
              <ProtectedRoute>
                <ChatWindow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/showuser/:username"
            element={
              <ProtectedRoute>
                <GlobalProfilepage />
              </ProtectedRoute>
            }
          />

          {/* ---------- Nested “Pages” Section (All Protected) ---------- */}
          <Route
            path="/pages"
            element={
              <ProtectedRoute>
                <Pages />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="create" element={<CreatePostPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* ---------- Fallback ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer />
      </Router>
    </AppProvider>
  );
}

export default App;
