const  mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching-v3')

const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/



const GameSchema = mongoose.Schema({
                        username: {
                            type: String,
                            required: true,
                            unique: true,
                        },
                        email: {
                            type: String,
                            required: true,
                            unique: true,
                            validate: emailRegex,
                        },
                        password: {
                            type: String,
                            required: true,
                        },
                        following: {
                            type: [mongoose.Schema.ObjectId],
                            ref: 'User',
                        },
                        followers: {
                            type: [mongoose.Schema.ObjectId],
                            ref: 'User',
                        },
                        posts: {
                            type: [mongoose.Schema.ObjectId],
                            ref: 'Post',
                        },
                        timeline: {
                            type: [mongoose.Schema.ObjectId],
                            ref: 'Post',
                        }
                    })

const UserModel = mongoose.model('Game', GameSchema)

module.exports = UserModel