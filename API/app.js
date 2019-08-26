const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.use(bodyParser.json());

// Import Routes
const postRoutes = require('./routes/post');
const getRoutes = require('./routes/get');
const authRoutes = require('./routes/auth');
app.use('/post', postRoutes);
app.use('/get', getRoutes);
app.use('/auth', authRoutes);
app.use('/ntStaticDownload', express.static('uploads'));





app.listen(3000);