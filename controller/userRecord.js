require('dotenv').config()
const {
	user
} = require('../Models/userRecord')
const {
	admin
} = require('../Models/adminLogin')
const {
	SECRET
} = require("../config/config")
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
// const bcrypt = require('bcrypt')
const bcrypt = require('bcryptjs')
// var mailgun = require('mailgun-js')({
// 	apiKey: process.env.MAILGUN_API_KEY,
// 	domain: 'sandbox7307e58fa8f64f25bd6b290a51736097.mailgun.org'
// });

// const {sendOtp} = require("./otp");

function decodeToken(req) {
	const token = req.headers.token
	const decoded = jwt.verify(token, new Buffer(SECRET, 'base64'));
	return decoded;
}

const adminDetails = async(req, res) => {
	try {
		const existUser = await user.findOne({
			email: req.body.email
		});
		if (existUser) {
			return ({
				"message": "user already exist"
			})
		} else {
			const userInfo = req.body;
			var myPlaintesxtPassword = userInfo.password;
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(myPlaintesxtPassword, salt)
			var rol = 'Examiner'
			userInfo.accountType = rol
			userInfo.password = hash; {
				user.create(userInfo)
				sgMail.setApiKey(SENDGRID_API_KEY);
				const msg = {
					to: userInfo.email,
					from: 'noreply@example.com',
					subject: 'You have been successfully registered on CYGRP Exam Portal',
					text: "email=" + userInfo.email + '  password=' + myPlaintesxtPassword + '  Congrats ! YOU HAVE BEEN REGISTRED ON CYBERGROUP EXAM_PORTAL AS EXAMINER',
				};
				sgMail.send(msg);
				return ({
					"status": "200",
					"message": "user registered"
				})


			}
		}
	} catch (error) {
		return ({
			error: error
		})
	}
}

const loggedInDetails = async(req, res) => {
	const decoded = decodeToken(req);
	const det = await user.findOne({
		"email": decoded.email
	});
	return det;
}

const userDetails = async(req, res) => {
	try {
		const query = await user.findOne({
			email: req.body.email
		})
		return query
	} catch (error) {
		return ("User not found")
	}
}


const examinerUpdate = async(req, res) => {
	try {
		const body = req.body
		const myPlaintextPassword = body.password;
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(myPlaintextPassword, salt)
		body.password = hash;
		const query = await user.findOneAndUpdate({
			email: req.body.email
		}, body)
		return ({
			"status": "200",
			"message": "user updated"
		});
	} catch (error) {
		return ("User details not valid")
	}

}

const fetchData = async(req, res) => {
	const data = await user.find({
		'accountType': 'Examiner'
	});
	let arr = [];
	for (i = 0; i < data.length; i++) {
		let newObject = {}
		newObject._id = data[i]._id;
		newObject.email = data[i].email;
		newObject.createdDate = data[i].createdDate.toDateString();
		newObject.name = data[i].name;
		arr.push(newObject)
	}
	return arr
}
const updateuser = async(req, res) => {
	const id = req.body.id;
	const data = await user.findByIdAndUpdate(id, req.body);
	return data;
}

const adminLogin = async(req, res) => {
	const existUser = await admin.findOne({
		email: req.body.email
	});
	if (existUser) {
		const pass = await bcrypt.compare(req.body.password, existUser.password);
		if (pass) {
			res.send({
				"message": "Admin valid"
			});
		} else {
			res.send({
				"message": "Email or password is not valid"
			});
		}
	} else {
		res.send({
			"message": "Email or password is not valid"
		});
	}
}

const userRecord = async(req, res) => {
	var status='';
			var message='';
	try {
		
			
		const email = req.body.email
		const body = req.body

		// var validator = require('mailgun-validate-email')('pubkey-a225fc837c8bc5960b76c7f4d13ec687')
		// const val =await validator(req.body.email, async function (err, result) {
			
		// 	if (result.mailbox_verification=="unknown"||err) {
		// 		// email was not valid
				
		// 			status ="400";
		// 			message="invalid email"
				
		// 	}else {
				
		// 	}
			
		// 		//console.log(result);
		// 		// register the person for your service etc.
				
			
		// })
		const existUser = await user.findOne({
			email: email
		});
		if (existUser) {
			return ("user Exist")
		} else {
			const userInfo = body;
			var myPlaintesxtPassword = body.password;
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(myPlaintesxtPassword, salt)
			var role = 'Student'
			userInfo.accountType = role
			userInfo.password = hash;
			user.create(userInfo)
			return response ={
				status:"200",
			message:"sign up successful"
			}
			
		}
		
		
		
		
	} catch (error) {
		return ({
			error: error
		})
	}
	
}

module.exports = {
	userRecord,
	userDetails,
	decodeToken,
	fetchData,
	updateuser,
	adminLogin,
	adminDetails,
	loggedInDetails,
	examinerUpdate,
	user
}