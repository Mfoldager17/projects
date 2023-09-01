const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function (next) {
    const user = this

    // If password is unchanged
    if (!user.isModified('password')) return next()

    // Hash password
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function (candidatePw, callback) {
    return callback(null, bcrypt.compareSync(candidatePw, this.password))
}

module.exports = mongoose.model('User', userSchema)
