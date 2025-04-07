require('dotenv').config();
const express = require("express");
const session = require('express-session');
const redis = require('redis');
const { RedisStore } = require('connect-redis');
const router = require('./api/routes/index');
const bodyParser = require('body-parser');
require('./api/models/User');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.connect();

const redisStore = new RedisStore({
    client: client,
});

app.use(session({
    store: redisStore,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}`));