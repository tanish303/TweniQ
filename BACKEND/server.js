require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./Models/db'); // MongoDB connection
const Signup = require('./Routes/Signup');
const Signin = require('./Routes/Signin');
const Resetpassword = require('./Routes/Resetpassword');
const CreatePost = require('./Routes/CreatePost');
const FetchPosts = require('./Routes/FetchPosts');
const FF = require('./Routes/Follow-Following');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/signup', Signup);
app.use('/signin', Signin);
app.use('/resetpassword', Resetpassword);
app.use('/createpost', CreatePost);
app.use('/fetchposts', FetchPosts);
app.use('/ff', FF);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
