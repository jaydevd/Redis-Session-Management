/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { Chat, SendComment } = require('../../../controllers/user/communication/ChatController');
const isUserAuthenticated = require('../../../middlewares/isUserAuthenticated');

const router = express.Router();

router.route('/chat')
    .all(isUserAuthenticated)
    .get(Chat);

router.route('/SendComment')
    .all(isUserAuthenticated)
    .post(SendComment);

module.exports = { ChatRoutes: router };