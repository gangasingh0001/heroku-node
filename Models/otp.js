const mongoose = require('mongoose')
delete mongoose.connection.models['user']
const Schema = mongoose.Schema
const moment = require('moment')
const verification = new Schema({
    email : String,
    accountVerified:Boolean,
    otp:Number,
    phoneNumber:Number,
    otpCreatedAt: {
        type:Date,
        default: Date.now
    }
})
const verify = mongoose.model('verification', verification)
module.exports = {
    verify
}
