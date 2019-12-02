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
const {
	verify
} = require('../Models/otp');
var SENDGRID_API_KEY = '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'
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
	const obj = new Object()
	obj.email = det.email
	obj.name = det.name
	obj.collegeName = det.collegeName
	obj.phoneNumber = det.phoneNumber
	console.log(obj)
	return obj;
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
		// const myPlaintextPassword = body.password;
		// var salt = bcrypt.genSaltSync(10);
		// var hash = bcrypt.hashSync(myPlaintextPassword, salt)
		// body.password = hash;
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
	const userOtpinfo = await verify.findOne({
		email: req.body.email
	})
	if ((existUser)) {
		if(userOtpinfo.activeStatus==true){
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
		}else {
			const otp = Math.floor(100000 + Math.random() * 900000);
			const accountSid = 'AC1a76f68d50dcfa8b46599145bb11d61d';
			const authToken = 'a48e94177384fa0db870f3ba2c05f9cc';
			const client = require('twilio')(accountSid, authToken);
			await verify.update({email:req.body.email},{"otp":otp,"phoneNumber":req.body.phoneNumber},()=>{
				client.messages
					.create({
						body: otp,
						from: '+12512548483',
						to: req.body.phoneNumber
					})
					.then(message => console.log(message.sid));
			}).catch((err)=>{
				return({
					"message": err
				})
			})
			
		}
		
	} else {
		res.send({
			"message": "Email or password is not valid"
		});
	}
}

const userRecord = async(req, res) => {
	try {
		const existUser = await user.findOne({
			email: req.body.email
		});
		if (existUser) {
			return ("user Exist")
		} else {
			const userInfo = req.body;
			var myPlaintesxtPassword = userInfo.password;
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(myPlaintesxtPassword, salt)
			var role = 'Student'
			userInfo.accountType = role
			userInfo.password = hash; {
				const otp = Math.floor(100000 + Math.random() * 900000);
				user.create(userInfo)
				sgMail.setApiKey(SENDGRID_API_KEY);
				const msg = {
					to: userInfo.email,
					from: 'noreply@example.com',
					subject: 'You have been successfully registered on CYGRP Exam Portal',
					text: userInfo.name + '   Congrats ! YOU HAVE BEEN REGISTRED ON CYBERGROUP EXAM_PORTAL AS STUDENT',
				};
				sgMail.send(msg);
				const accountSid = 'AC1a76f68d50dcfa8b46599145bb11d61d';
				const authToken = 'a48e94177384fa0db870f3ba2c05f9cc';
				const client = require('twilio')(accountSid, authToken);
				const phone = req.body.password;
				var verificationDetails = {
					"email": userInfo.email,
					"activeStatus": false,
					"otp":otp,
					"phoneNumber":phone
				}
				await verify.create(verificationDetails).then(()=>{
					client.messages
					.create({
						body: "please enter this otp "+otp,
						from: '+12512548483',
						to:phone
					})
					.then(message => console.log(message.sid));
				}).catch((err)=>{
					console.log("-------------------------error----------------------" + err);
					return({
						"message": err
					})
				})
				
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

module.exports = {
	userRecord,
	userDetails,
	decodeToken,
	fetchData,
	updateuser,
	adminLogin,
	adminDetails,
	loggedInDetails,
	examinerUpdate
}