const jwt = require("jsonwebtoken");
const {
	SECRET
} = require('../config/config')
const {
	Users
} = require("../controller");
const bcrypt = require('bcryptjs')
const {
	verify
} = require('../Models/otp');
// const { otp } = require("../controller")
const { createEntry } = require("../controller/otp");



async function matchCredentials(req, res) {

	const user = await Users.userDetails(req, res)

	if (user == null) {
		return "Do sign up"
	} else if (user.email == req.body.email) {
		return "matched"
	}
}

async function comparePassword(myPlaintextPassword, req) {
	const user = await Users.userDetails(req)
	//i have returned account type here so we can redirect page to admin or student or examiner
	//redirect happens in login page
	const hash = user.password
	if (bcrypt.compareSync(myPlaintextPassword, hash)) {
		return user.accountType
	} else {
		return "0"
	}
}

async function generateToken(req, details) {
	let email = req.body.email;
	const user = await Users.userDetails(req);
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


async function checkAuth(req) {
	const data = await matchCredentials(req);
	if (data == "matched") {
		const valuePass = await comparePassword(req.body.password, req) //valuePass can be namesd as accountTyp
		if (valuePass == "Examiner" || valuePass == "Student" || valuePass == "Admin") {
			const details = await verify.findOne({
				email: req.body.email
			}, (err) => {
				return {
					"code": "400",
					"message": err
				};
			})
			if (details == null) {
				const user = await Users.userDetails(req);
				const detailsForOtp = {
					"email": user.email,
					"phoneNumber": user.phoneNumber
				}
				const result = await createEntry(detailsForOtp).catch((err)=>{
					console.log(err)
				})
				// (detailsForOtp).catch((err)=>(
				// 	console.log(err)
				// ))
				if(result.code==200){
					return ({
						"message": "password matched",
						"accountType": valuePass,
						"verification": "required",
						"firstTimeLogin": true,
					})
				}
			} else {
				if (details.accountVerified == true) {
					const token = await generateToken(req, details);
					return ({
						"message": "password matched",
						"token": token,
						"accountType": valuePass,
						"firstTimeLogin": false
					})
				} else {
					return ({
						"message": "password matched",
						"accountType": valuePass,
						"verification": "required",
						"firstTimeLogin": false
					})
				}
			}


		} else {
			return ({
				"message": "password not matched",
				"token": "null",
			})
		}
	} else {
		return ({
			"message": "user not exists please sign up",
			"token": "null",
		})
	}
}

module.exports = {
	checkAuth,
	generateToken
}