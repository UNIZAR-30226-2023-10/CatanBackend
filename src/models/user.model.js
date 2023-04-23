const  mongoose = require('mongoose')
const bcrypt    = require('bcrypt')
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching-v3')
const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailRegex,
            message: () => 'El correo electronico no es valido'
        }
    },
    password: {
        type: String,
        required: true,
    },
})

UserSchema.pre('save', function (next) {
    var user = this

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()
    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err)

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)

            // override the cleartext password with the hashed one
            user.password = hash
            next()
        })
    })
})

UserSchema.plugin( mongoose_fuzzy_searching, {fields : [ 'username' ]})


const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel