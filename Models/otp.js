const mongoose = require('mongoose')
delete mongoose.connection.models['user']
const Schema = mongoose.Schema
const verification = new Schema({
    email : String,
    activeStatus:Boolean,
    otp:Number,
    phoneNumber:Number
})

const verify = mongoose.model('verification', verification)

module.exports = {
    verify
}
