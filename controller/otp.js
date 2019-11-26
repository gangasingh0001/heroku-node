require('dotenv').config()

const {
	verify
} = require('../Models/otp')
const jwt = require("jsonwebtoken");
const {
	SECRET
} = require('../config/config')
//const result;
const 
	record
 = require("./userRecord");



const decision = async(req) => {
	// TODO: use decoded token

	if (result == null) {
		sendOtpUserNotExist(req);
	} else {
		if (result.accountVerified == true) {
			return {
				"code": "200",
				"message": "user already verified"
			}
		} else {
			sendOtpUserExist(req)
		}

	}
}

async function generateToken(details) {
	debugger
	
	const user = await record.user.findOne({
		email: details.email
	})
	const email = user.email
	// const user = await Users.userDetails(req);
	const id = user._id;
	const verified = details.accountVerified;
	const claim = user.accountType
	var token = jwt.sign({
		email,
		expiresIn: '1h',
		id,
		claim,
		verified
	}, new Buffer(SECRET, 'base64'));
	return token;
}

const otpVerification = async(req) => {
	// async function otpVerification (req) {
		debugger
	
	const decodedEmail = req.headers.email;
	// const decodedEmail=req.body.email;
	const result = await verify.findOne({
		email: decodedEmail
	}, (err) => {
		return err;
	})
	if (result == null) {
		return {
			"code": "400",
			"message": "Email not found"
		}
	} else {
		if (result.otp == req.body.otp) {
			const response = await verify.update({
				email: decodedEmail
			}, {
				accountVerified: true
			}, (err) => {
				console.log(err)
			}).then(async function () {
				const result = await verify.findOne({
					email: decodedEmail
				})
				return {
					"code": "200",
					"message": "verified successfully",
					"token": await generateToken(result)
				}
			})
			return response;
		}else {
			return {
				"code": "400",
				"message": "Otp not matched"
			}
		}
	}
}

const createEntry = async(req) => {
	// async function createEntry(req){
	const otp = Math.floor(100000 + Math.random() * 900000);
	const verificationDetails = {
		"email": req.email,
		"accountVerified": false,
		"otp": otp,
		"phoneNumber": req.phoneNumber
	}
	// Create an entry of user in Verification model
	await verify.create(verificationDetails)
		.catch((err) => {
			return err;
		})
	return {
		"code": 200,
		"message": "success"
	};
}

const sendOtpUserExist = async(req) => {

	// async function sendOtpUserExist (req) {
	// const userInfo = req.body;
	// const decoded = req.headers.email
	const result = await verify.findOne({
		email: req.headers.email
	}, (err) => { // use decodedEmail in req.body.email
		return err;
	})
	const otp = Math.floor(100000 + Math.random() * 900000);
	const accountSid = 'AC1a76f68d50dcfa8b46599145bb11d61d';
	const authToken = 'a48e94177384fa0db870f3ba2c05f9cc';
	// const client = require('twilio')(accountSid, authToken);
	// const phone = "+" + result.phoneNumber;
	await verify.updateOne({
		email: req.headers.email
	}, {
		otp: otp
	}, (err) => {
		return err;
	})
	debugger
	// await client.messages.create({
	// 	body: "please enter this otp " + otp + " to verify your account.",
	// 	from: '+12512548483',
	// 	to: phone
	// }).then(message => console.log(message.sid)).catch((err) => {
	// 	console.log(err)
	// })

	// const mailgun = require("mailgun-js");
	// const DOMAIN = 'YOUR_DOMAIN_NAME';
	// const mg = mailgun({
	// 	apiKey: "a3de4f811ba8b137e39f05b92cad25a7-9c988ee3-e70fdd3a",
	// 	domain: DOMAIN
	// });
	// const data = {
	// 	from: 'Excited User <me@samples.mailgun.org>',
	// 	to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
	// 	subject: 'Hello',
	// 	text: 'Testing some Mailgun awesomness!'
	// };
	// mg.messages().send(data, function (error, body) {
	// 	console.log(body);
	// });
    
	const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
	const msg = {
		to: req.headers.email,
		from: 'gangaldh@yahoo.com',
		subject: 'Your OTP to verify account',
		text: 'Your one time password is '+otp+' Please enter it to verify your account',
	};
	sgMail.send(msg);

	const response = {
		"status": "200",
		"message": "otp sent"
	}

	return response;
}


module.exports = {
	otpVerification,
	decision,
	sendOtpUserExist,
	createEntry
}