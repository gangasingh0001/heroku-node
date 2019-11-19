const jwt = require("jsonwebtoken");
const { SECRET } = require('../config/config')
const { Users } = require("../controller");
const bcrypt = require('bcryptjs')

async function matchCredentials(req,res){
	
	const user = await Users.userDetails(req,res)

	if(user == null) { return "Do sign up"}
	else if(user.email == req.body.email){
		return "matched"
	}
}

async function comparePassword(myPlaintextPassword,req){
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

async function generateToken(req) {
	let email = req.body.email;
	const user = await Users.userDetails(req);
	const id = user._id;
	const claim = user.accountType
	var token = jwt.sign({ email, expiresIn: '24h', id, claim }, new Buffer(SECRET, 'base64'));
	return token;
}

async function checkAuth(req) {
	const data = await matchCredentials(req);
	if (data == "matched") {
		const valuePass = await comparePassword(req.body.password, req)
		if (valuePass == "Examiner" || valuePass == "Student" || valuePass =="Admin") {
			const token = await generateToken(req);
			return ({
				"message": "password matched",
				"token": token,
				"accountType":valuePass
			})
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
	checkAuth
}
