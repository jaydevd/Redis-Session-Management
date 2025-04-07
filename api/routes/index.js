/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { UserAuthRoutes } = require('./user/authentication/UserAuthRoutes.js');
const isUserAuthenticated = require('../middlewares/isUserAuthenticated.js');
const router = express.Router();

// user routes
router.use('/user/authentication', UserAuthRoutes);

router.route('/user/dashboard')
    .all(isUserAuthenticated)
    .get((req, res) => {
        res.send(`Welcome to your dashboard, ${req.session.user.name}!`);
    })

module.exports = router;