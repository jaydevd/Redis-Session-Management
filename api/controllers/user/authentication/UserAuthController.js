/**
 * @name signup/login/logout
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { User } = require('./../../../models/User');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { Sequelize, Op } = require('sequelize');

const UserSignUp = async (req, res) => {

    try {
        const { name, email, password, age, gender, country, city, company } = req.body;

        let validation = new Validator({
            name: name,
            email: email,
            password: password
        },
            {
                name: ["required", "max:30"],
                email: ["required", "email"],
                password: "required"
            }
        )

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                data: '',
                message: 'Invalid Credentials',
                error: validation.errors.all()
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        const result = await User.create({
            id: id,
            name: name,
            email: email,
            password: hashedPassword,
            createdBy: id,
            createdAt: Math.floor(Date.now() / 1000),
            isActive: true,
            isDeleted: false
        });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            data: result.id,
            message: 'Data Created Successfully',
            error: ''
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: error.message
        })
    }
}

const UserLogIn = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const user = await User.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'email', 'password', 'token']
        });

        if (!user) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: "User Not Found",
                data: "",
                error: ""
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: PAGE_NOT_FOUND,
                message: "Invalid Credentials",
                data: "",
                error: "Passwords doesn't match"
            })
        }

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        const result = await User.update(
            { token: token },
            {
                where: {
                    id: user.id,
                },
            },
        );

        req.session.user = { name };
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: `Hello ${name}, you are now logged in.`,
            error: ''
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: error.message
        });
    }
}

const UserLogOut = async (req, res) => {
    try {

        const { token } = req.body;

        const user = await User.findOne({
            where: { token: token },
            attributes: ['id', 'token']
        });

        if ((token !== user.token)) {
            return res.json({
                status: '400',
                message: 'No user found',
                data: '',
                error: ''
            })
        }

        await User.update({ token: null }, { where: { id: user.id } });

        req.session.destroy((err) => {
            if (err) return res.status(500).send('Could not log out.');
            res.send('Logged out successfully.');
        });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: 'Logged out successfully',
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

module.exports = {
    UserSignUp,
    UserLogIn,
    UserLogOut
}