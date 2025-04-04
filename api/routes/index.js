/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { UserAuthRoutes } = require('./user/authentication/UserAuthRoutes.js');
const { ChatRoutes } = require('./user/communication/ChatRoutes.js');
const { ProfileRoutes } = require('./user/profile/ProfileRoutes.js');
const router = express.Router();

// user routes
router.use('/user/authentication', UserAuthRoutes);
router.use('/user/communication', ChatRoutes);
router.use('/user/profile', ProfileRoutes);

module.exports = router;