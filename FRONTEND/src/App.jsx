import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Landingpage from "./components/Landingpage"
import Signup from "./components/Signup"
import Setupprofile from "./components/Setupprofile"
import Signin from "./components/Signin"
import ResetPassword from "./components/ResetPasswords"
import Pages from "./Pages"
import HomePage from "./components/HomePage"
import FeedPage from "./components/FeedPage"
import CreatePostPage from "./components/CreatePostPage"
import AccountPage from "./components/AccountPage"
import CommentSection from "./components/CommentSection"
import { AppProvider } from "./context/AppContext"
import ViewPersonalPosts from "./components/ViewPersonalPosts"
import ChatPage      from "./components/ChatPage";     // <-- list + search
import ChatWindow    from "./components/ChatWindow";   // <-- messages

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/setupprofile" element={<Setupprofile />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/commentsection" element={<CommentSection />} />
          <Route path="/account/:category" element={<ViewPersonalPosts />} />
          <Route path="/chat"            element={<ChatPage />} />        
          <Route path="/chat/:roomId"    element={<ChatWindow />} />
   

          <Route path="/pages" element={<Pages />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="create" element={<CreatePostPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/pages/home" replace />} />
        </Routes>
        <ToastContainer />
      </Router>
    </AppProvider>
  )
}

export default App
