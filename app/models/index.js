import { url } from '../config/db.config.js'
import mongoose, { Promise } from 'mongoose'
import users from './user.model.js'
import posts from './game.model.js'

mongoose.Promise = global.Promise
const db = {
    mongoose: mongoose,
    url: url,
    users: users,
    posts: posts,
}
db.mongoose = mongoose
db.url = url
db.users = require('./user.model.js').default(mongoose)
db.posts = require('./game.model.js').default(mongoose)
export default db