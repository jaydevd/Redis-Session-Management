/**
 * @name signup/login/logout
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { User } = require('./../../../models/index');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { Sequelize, Op } = require('sequelize');

const Chat = async (req, res) => {
    try {
        if (!req.session.key) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.UNAUTHORIZED,
                message: 'Session key not found',
                data: '',
                error: ''
            })
        }
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: req.session.key,
            error: ''
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const SendComment = async (req, res) => {
    try {
        if (!req.session.key) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.UNAUTHORIZED,
                message: 'Session key not found',
                data: '',
                error: ''
            })
        }
        executeSendCommmentDbCommand(req.body.Email, req.body.Recipient, req.body.Comment, function (dbResult) {
            if (!dbResult) {
                return res.status(401).json({
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                    message: 'Comment not sent',
                    data: '',
                    error: ''
                })
            }
        });
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: 'Comment has been sent successfully.',
            data: '',
            error: ''
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

module.exports = { Chat, SendComment };