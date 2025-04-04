require('dotenv').config();
const express = require("express");
const session = require('express-session');
const redis = require("redis");
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const router = require('./api/routes/user/authentication/UserAuthRoutes');
const app = express();

app.use(session({
    secret: 'mysecret',
    // create new redis store.
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient
    }),
    saveUninitialized: false,
    resave: false
}));

app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}`));