const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

const userRoutes = require('./routes/users');
const post_Router = require('./routes/post');
const groupRoutes = require('./routes/group');
const statisticsRouter = require('./routes/statistics');

dotenv.config({ path: './config/.env' });

mongoose.connect(process.env.CONNECTION_STRING);

mongoose.connect(process.env.CONNECTION_STRING, { })
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});


const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.use(express.urlencoded({ extended: false }));

app.use('/', userRoutes);

app.use('/posts', post_Router);
app.use('/groups', groupRoutes);
app.use('/statistics', statisticsRouter);

app.get('/feed', (req, res) => {
    res.render('index');
});


app.listen(process.env.PORT);
