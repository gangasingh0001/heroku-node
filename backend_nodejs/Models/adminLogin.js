const mongoose  = require('mongoose')

const Schema = mongoose.Schema

const adminLogin = new Schema({
	email: String,
	password:String,
	})

const admin = mongoose.model('admin',adminLogin)

module.exports = {
	admin
}
