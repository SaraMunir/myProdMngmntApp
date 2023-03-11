const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Owner", "Admin", "Member"]
    },
    password: {
        type: String,
    },
})

module.exports = mongoose.model('User', UserSchema);