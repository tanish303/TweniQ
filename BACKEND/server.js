require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const http     = require("http");
const mongoose = require("./Models/db");

const Signup        = require("./Routes/Signup");
const Signin        = require("./Routes/Signin");
const Resetpassword = require("./Routes/Resetpassword");
const CreatePost    = require("./Routes/CreatePost");
const FetchPosts    = require("./Routes/FetchPosts");
const FF            = require("./Routes/Follow-Following");
const LikeUnlike    = require("./Routes/LikeUnlike");
const SavePost      = require("./Routes/SavePost");
const Comments      = require("./Routes/Comments");
const Poll          = require("./Routes/Poll");
const AccountInfo   = require("./Routes/AccountInfo");
const Chat          = require("./Routes/Chat");
const GlobalUserData          = require("./Routes/GlobalUserData");

const app = express();
app.use(cors({
  origin: "https://tweniq.vercel.app",
  credentials: true
}));
app.use(express.json());


app.use("/signup",       Signup);
app.use("/signin",       Signin);
app.use("/resetpassword",Resetpassword);
app.use("/createpost",   CreatePost);
app.use("/fetchposts",   FetchPosts);
app.use("/ff",           FF);
app.use("/likeunlike",   LikeUnlike);
app.use("/savepost",     SavePost);
app.use("/comments",     Comments);
app.use("/poll",         Poll);
app.use("/account",      AccountInfo);
app.use("/chat",         Chat);
app.use("/showuser",         GlobalUserData);

const server = http.createServer(app);
require("./socket")(server);

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`🚀 REST & WebSocket server running on http://localhost:${PORT}`)
);
