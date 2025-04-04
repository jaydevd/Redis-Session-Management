const express = require('express');
const router = express.Router();
const { GetProfile } = require('./../../../controllers/user/profile/ProfileController');

router.route('/home')
    .get(GetProfile);

module.exports = { ProfileRoutes: router };