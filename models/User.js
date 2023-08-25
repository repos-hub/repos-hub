const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {type: String, required: true}
})

const model = mongoose.model('users', User)

module.exports = model