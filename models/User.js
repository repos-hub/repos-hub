const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
})

const model = mongoose.model('users', User)

module.exports = model