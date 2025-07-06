const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const post_Router = require('./routes/post');
const users_Router = require('./routes/users');
const groups_Router = require('./routes/groups');


require('custom-env').env(process.env.NODE_ENV,'./config');
mongoose.connect(process.env.CONNECTION_STRING, { });
    
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.set('view engine', 'ejs');
app.use(express.static('public'));

//routes
app.use('/posts', post_Router);
app.use('/users', users_Router);
app.use('/groups', groups_Router);


app.listen(process.env.PORT);