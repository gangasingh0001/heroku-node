const express = require('express')
const app = express()
const { Users } = require('../controller')
const { Ques } = require('../controller')
const middleware = require("../auth/middleware");
const jwt = require('jsonwebtoken');
const { SECRET } = require("../config/config")
const multer = require('multer')
const path = require('path')
const reqPath = path.join(__dirname, '../../../frontend/exminer/public/assets');
var storage = multer.memoryStorage()
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if(file.originalname.includes(".xlsx"))
            callback(null, 'upload/')
        else
            callback(null,reqPath)
    },
    filename: function (req, file, callback) {
        callback(null,Date.now()+'-'+file.originalname);
    }
});


// const upload = multer({storage:storage})
const upload = multer({ limits: {fileSize: 1000000 },storage: storage })
// var upload = multer({ dest: 'upload/'});


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
    app.post('/exam/questions/uploadExcel', upload.single('excelFile'), (req, res) => {
        Users.quesFromExcel(req, res)
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
    app.post('/exam', middleware, (req, res) => {
        Users.examDetail(req, res)
    })

    //examiner will view exam
    app.get('/exam', middleware, (req, res) => {
            Users.viewExamDetail(req, res)

        })
        //examiner will fetch particular exam detail
    app.get('/exam/:id', middleware, (req, res) => {
        Users.fetchExamDetail(req, res)
    })

    //examiner will edit exam details
    app.patch('/exam/:id', middleware, (req, res) => {
        Users.editExam(req, res)
    })

    //examiner will delete exam using exam id
    app.delete('/exam/:id', middleware, (req, res) => {
        Users.removeExam(req, res)
    })

    //examiner will view exams he has created
    app.get('/examiner/exams', middleware, async(req, res) => {
            const response = await Users.studentPerformance(req, res)
            res.send(response)
        })
        // examiner will view details of all the students who gave that particular exam
    app.get('/examiner/exams/students', middleware, async(req, res) => {
        const response = await Users.studPerformance(req, res)
    })

    app.post('/exam/question', upload.single('questionImage'), (req, res) => {
        if (req.file) {
            req.body['questionImage'] = '../public/assets/' + req.file.filename;
        } else {
            req.body['questionImage'] = null
        }

        Users.question(req, res)
    })

    //examiner will view questions
    app.get('/exam/:examCode/question', middleware, (req, res) => {
        //console.log(decodeURIComponent(req.params.examCode))
        Users.getQuestionDetail(req, res)
    })

    //get particular question using its ID
    app.get('/exam/question/:id', middleware, (req, res) => {
        
        console.log(req.params.id)
        Users.fetchQuestionById(req, res)
    })

    //examiner will edit questions
    app.patch('/exam/question/:id', upload.single('questionImage'), middleware, (req, res) => {
        //console.log('edit pic',req.file)
        if (req.file) {
            req.body['questionImage'] = '../public/assets/' + req.file.filename
        } else {
            req.body['questionImage'] = null
        }
        //console.log(req.file)
        Users.editQuestion(req, res)
    })

    //examiner will delete question by id
    app.delete('/exam/question/:id', middleware, (req, res) => {
        Users.removeQuestion(req, res)
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

    // //admin will add examiner
    // app.post('/examiner', middleware, (req, res) => {
    //     const response = adminDetail.adminDetails(req, res)
    //     return response;
    // })
    //admin will add examiner
    app.post('/examiner', async(req, res) => {
        const response = await Users.adminDetails(req, res)
        res.send(response);
    })

    //admin will view examiner
    app.get('/examiner', async(req, res) => {
            const result = await Users.fetchData(req, res)
            res.send(result);
        })
        //admin will delete examiner using id of examiner
    app.delete('/examiner/:id', (req, res) => {
            const result = Users.examinerDelete(req, res)
            res.send(result)
        })
        //admin will view test created by each examiner using their id
    app.get('/examiner/:id', middleware, async(req, res) => {
        const result = await Users.testDetails(req, res)
        res.send(result);
    })

    app.patch('/examiner', middleware, async(req, res) => {
            const result = await Users.examinerUpdate(req, res)
            res.send(result)
        })
        // admin update examiner info
    app.patch('/examiner/:id', async(req, res) => {
        const result = await Users.updateUser(req, res);
        res.send(result);
    })
    return app
}