const mongoose = require('mongoose')
const { model, Schema } = mongoose
const bcrypt = require('bcrypt')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const HASH_ROUND = 10

let userSchema = Schema({
    full_name: {
        type: String,
        required: [true, 'Full name must be filled!'],
        maxLength: [255, 'Full name max length is 255 character.'],
        minLength: [3, 'Full name min length is 3 character.']
    },
    username: {
        type: String,
        required: [true, 'Username must be filled!'],
        maxLength: [50, 'Username max length is 50 character.']
    },
    email: {
        type: String,
        required: [true, 'Email must be filled!'],
        maxLength: [100, 'Email max length is 50 character.']
    },
    password: {
        type: String,
        required: [true, 'Password must be filled!'],
        maxLength: [255, 'Password max length is 255 character.'],
        minLength: [6, 'Password min length is 6 character.']
    },
    profile_picture: String,
    about_me: {
        type: String,
        maxLength: [255, 'Description max length is 255 character.']
    },
    token: [String]
}, {timestamps: true})

userSchema.path('username').validate(async function(value) {
    try {
        const count = await this.model('User').count({username: value})
        return !count
    } catch(err) {
        throw err
    }
}, attr => `${attr.value} already exists in our database!`)

userSchema.path('username').validate(async function (value) {
    const usernameRE = /^\S*$/
    return usernameRE.test(value)
}, `Username cannot have whitespace.`)

userSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('User').count({email: value})
        return !count
    } catch(err) {
        throw err
    }
}, attr => `${attr.value} already exists in our databases!`)

userSchema.path('email').validate(function(value) {
    const emailRE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return emailRE.test(value)
}, attr => `${attr.value} must be an valid email addresses!`)

userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

userSchema.plugin(AutoIncrement, {inc_field: 'user_id'})

module.exports = model('User', userSchema)