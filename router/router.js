const express = require('express')
const app = express()
const {
	Users
} = require('../controller')
const {
	Ques
} = require('../controller')
const middleware = require("../auth/middleware");
const jwt = require('jsonwebtoken');
const {
	SECRET
} = require("../config/config")
const multer = require('multer')
const path = require('path')
const reqPath = path.join(__dirname, '../../../assets');
const aws = require('../aws/aws')
var storage = multer.memoryStorage()
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'upload/')
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + '-' + file.originalname);
	}
});

const upload = multer({
	limits: {
		fieldSize: 8 * 1024 * 1024
	},
	storage: storage
})

const createToken = require("../auth/authenticator").checkAuth;

module.exports = () => {

	app.post('/login', async(req, res) => {
		const result = await createToken(req)
		if (result.token == "null") {
			res.status(400).send(result)
		} else {
			res.status(200).send(result)
		}
	})

	app.post('/signUp', async(req, res) => {
		const result = await Users.userRecord(req, res)
		res.send(result)
	})

	//  for viewing the details of loggedin user
	app.get('/loggedIn', async(req, res) => {
		const response = await Users.loggedInDetails(req, res)
		res.send(response)
	})
	// For uploading questions directly from excel file
	app.post('/exam/questions/uploadExcel', middleware, upload.single('excelFile'), (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.quesFromExcel(req, res)
		} else {
			res.status(401).send('unauthorized')
		}
	})

	app.post('/exam/accessKey', middleware, async(req, res) => {
		const response = await Ques.checkAccessKey(req, res)
		return response
	})

	app.get('/exam/accessKey', middleware, async(req, res) => {
		const response = await Ques.getExamTime(req, res)
		return response
	})

	app.post('/exam/endTest', middleware, async(req, res) => {
		const response = await Ques.saveAllQuestions(req, res)
		return response
	})

	//examiner will create exam details
	app.post('/exam',middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.examDetail(req, res)
			//res.status(200).send()
		}
		else{
			res.status(401).send('unauthorized')
		}
	})

	//examiner will view exam
	app.get('/exam', middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.viewExamDetail(req, res)	
        }
        else{
            res.status(401).send('unauthorized')
        }
		
	})
	//examiner will fetch particular exam detail
	app.get('/exam/:id', middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.fetchExamDetail(req, res)
		}else
		{
			res.status(401).send('unauthorized')
		}
	})

	//examiner will edit exam details
	app.patch('/exam/:id', middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.editExam(req, res)
		}else{
			res.status(401).send('unauthorized')
		}
	})

	//examiner will delete exam using exam id
	app.delete('/exam/:id', middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.removeExam(req, res)
		}
		else{
			res.status(401).send('unauthorized')
		}
	})

	//examiner will view exams he has created
	app.get('/examiner/exams', middleware, async(req, res) => {
		if (req.headers.role == "Examiner") {
			const response = await Users.studentPerformance(req, res)
			res.send(response)
		}else{
		res.status(401).send('unauthorized')
		}
	})
	// examiner will view details of all the students who gave that particular exam
	app.get('/examiner/exams/students', async(req, res) => {
		if (req.headers.role = "Examiner") {
            const response = await Users.studPerformance(req, res)
            res.status(200).send(response)
		}else{
            res.status(401).send('unauthorized')
        }
		
	})

	app.post('/exam/question', upload.single('questionImage'), middleware, async (req, res) => {
		if (req.headers.role = "Examiner") {
				if (req.file) {
				await aws.uploadFile(req)
			} else {
				req.body['questionImage'] = null
			}
			Users.question(req, res)
		}
		else
		res.status(401).send('unauthorized')

	})

	//examiner will view questions
	app.get('/exam/:examCode/question', middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.getQuestionDetail(req, res)
		} else {
			res.status(401).send('unauthorized')
		}
	})

	//get particular question using its ID
	app.get('/exam/question/:id', middleware, (req, res) => {
		Users.fetchQuestionById(req, res)
	})

	//examiner will edit questions
	app.patch('/exam/question/:id', upload.single('questionImage'), middleware, async (req, res) => {
		if (req.headers.role == "Examiner") {
			if (req.file) {
				await aws.uploadFile(req)
			}
			Users.editQuestion(req, res)
		}else{
		res.status(401).send('unauthorized')
		}
	})

	//examiner will delete question by id
	app.delete('/exam/question/:id', middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			Users.removeQuestion(req, res)
		}
		else{
			res.status(401).send('unauthorized')
		}
	})

	//candidates will view quesions using accesskey
	app.get('/question', middleware, async(req, res) => {
		const response = await Ques.testQuestions(req, res)
		return response
	})

	//post answers selected by candidates
	app.post('/question', middleware, async(req, res) => {
		const response = await Ques.saveCandidateAnswers(req, res)
		return response
	})

	//admin will add examiner
	app.post('/examiner', middleware, async(req, res) => {
		if (req.headers.role == "Admin") {
			const response = await Users.adminDetails(req, res)
			res.send(response);
		}else
		res.status(401).send('unauthorized')
	})

	//admin will view examiner
	app.get('/examiner', middleware, async(req, res) => {
		if (req.headers.role == "Admin") {
			const result = await Users.fetchData(req, res)
			res.send(result);
		}else
		res.status(401).send('unauthorized')
	})
	//admin will delete examiner using id of examiner
	app.delete('/examiner/:id', middleware, (req, res) => {
		if (req.headers.role == "Admin") {
			const result = Users.examinerDelete(req, res)
			res.send(result)
		}else
		res.status(401).send('unauthorized')
	})
	//admin will view test created by each examiner using their id
	app.get('/examiner/:id', middleware, async(req, res) => {
		if (req.headers.role == "Admin") {
			const result = await Users.testDetails(req, res)
			res.send(result);
		}else
		res.status(401).send('unauthorized')
	})

	app.patch('/examiner', middleware, async(req, res) => {
		if (req.headers.role == "Examiner") {
			const result = await Users.examinerUpdate(req, res)
			res.send(result)
		}else
		res.status(401).send('unauthorized')
	})
	// admin update examiner info
	app.patch('/examiner/:id', async(req, res) => {
		const result = await Users.updateUser(req, res);
		res.send(result);
	})
	app.get('/checkexaminer',middleware, (req, res) => {
		if (req.headers.role == "Examiner") {
			res.status(200).send();
		} else {
			res.status(401).send("unauthorized")
		}

	})
	app.get('/checkadmin', middleware, (req, res) => {
		if (req.headers.role == "Admin") {
			res.status(200).send()
		} else {
			res.status(401).send("unauthorized")
		}

	})
	app.get('/userawake', middleware, (req, res) => {
		res.send(req.headers.role);

	})
	return app
}