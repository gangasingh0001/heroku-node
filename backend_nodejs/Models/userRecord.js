const mongoose = require('mongoose')
delete mongoose.connection.models['user']
const Schema = mongoose.Schema

const userdetail = new Schema({
    email: String,
    name: String,
    password: String,
    accountType: String,
    collegeName: String,
    phoneNumber: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    modifiedBy: String,
    permissionLevel: Number
})

const user = mongoose.model('user', userdetail)

module.exports = {
    user
}