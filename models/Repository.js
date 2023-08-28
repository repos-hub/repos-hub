const mongoose = require('mongoose');

const Repository = new mongoose.Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    stars: {type: String, required: true},
    forks: {type: String, required: true},
    watchers: {type: String, required: true},
    description: {type: String, required: true},
    repoofmonth: {type: Boolean, default: false},
    githublink: {type: String, required: true},
    websitelink: {type: String, required: true},
    docslink: {type: String, required: true},
    status: {type: String}
})

const model = mongoose.model('repos', Repository)

module.exports = model