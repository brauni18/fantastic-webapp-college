const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const post_Router = require('./routes/post');
const api_posts = require('./routes/api_posts');
const users_Router = require('./routes/users');
const api_users = require('./routes/api_users');
const groups_Router = require('./routes/groups');
const api_groups = require('./routes/api_groups');

require('custom-env').env(process.env.NODE_ENV,'./config');
mongoose.connect(process.env.CONNECTION_STRING, {});

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/posts', post_Router);
app.use('/api/posts',api_posts);
app.use('/users', users_Router);
app.use('/api/users', api_users);
app.use('/groups', groups_Router);
app.use('/api/groups', api_groups);
app.listen(process.env.PORT);