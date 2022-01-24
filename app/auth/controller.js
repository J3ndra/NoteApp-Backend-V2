const User = require('../user/model')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config')
const { getToken } = require('../utils/get-token');

const fs = require('fs');
const path = require('path');

async function register(req, res, next) {
    try {
        let payload = req.body

        if(req.file) {
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.resolve(config.rootPath, `public/upload/profiles/${filename}`)

            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async() => {
                try {
                    let user = new User({
                        ...payload,
                        profile_picture: filename
                    })
                    await user.save()

                    return res.json({
                        success: true,
                        message: 'User has been registered.',
                        user
                    })
                } catch (error) {
                    fs.unlinkSync(target_path)

                    if (error & error.name === 'ValidationError') {
                        return res.json({
                            success: false,
                            message: error.message,
                            fields: error.errors
                        })
                    }

                    next(error)
                }
            })
            src.on('error', async () => {
                next(error);
            })
        } else {
            let user = new User(payload)

            await user.save()

            return res.json({
                success: true,
                message: 'User has been created.',
                user
            })
        }
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                success: false,
                message: error.message,
                fields: error.errors
            });
        }

        next(error);
    }
}

async function localStrategy(email, password, done) {
    try {
        let user = await User
            .findOne({
                email
            })
            .select('-__v -createdAt -updatedAt -token')

        if (!user) return done()

        if (bcrypt.compareSync(password, user.password)) {
            ({
                password,
                ...userWithoutPassword
            } = user.toJSON())

            return done(null, userWithoutPassword)
        }
    } catch(err) {
        done(err, null)
    }
    done()
}

async function login(req, res, next) {
    passport.authenticate('local', async function(err, user) {
        if(err) return next(err)

        if(!user) return res.json({
            success: false,
            message: 'Email or password is incorrect!'
        })

        let signed = jwt.sign(user, config.secretKey)

        await User.findOneAndUpdate({_id: user._id}, {$push: {token: signed}}, {new: true})

        return res.json({
            success: true,
            message: 'Logged in successfully!',
            user: user,
            token: signed
        })
    })(req, res, next)
}

async function logout(req, res, next) {
    let token = getToken(req)

    let user = await User.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token}}, {useFindAndModify: false})

    if(!user || !token) {
        return res.json({
            success: false,
            error: 1,
            message: 'No user found.'
        })
    }

    return res.json({
        success: true,
        error: 0,
        message: 'Logged out successfully.'
    })
}

function me(req, res, next) {
    if(!req.user) {
        return res.json({
            success: false,
            message: 'Please login first or refresh token.'
        })
    }

    return res.json({
        success: true,
        message: 'Get user information.',
        user: req.user
    })
}

module.exports = {
    register,
    localStrategy,
    login,
    me,
    logout
}