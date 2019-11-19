const { questionDetail } = require('../models/question')
const { test } = require('../models/candidateAnswer')
const { examDetail } = require('../models/examDetail')
const {checkExistingRightOption, checkExistingWrongOption, radioOrCheckBoxValue} = require('./questionLogic')

const answerObject = (body,headers,weightage,status,submitStatus)=>{
    weightage = parseInt(weightage)
    let answerDetail = new test({
        candidateId: headers.id,
        totalScore: weightage,
        testCode: body.code,
        answers: [{
            answerSubmitted: body.checkedOption,
            questionId: body.qId,
            correctStatus: status
        }],
        submitExam: submitStatus
    })
    return answerDetail
}

//Show Test Questions to users according to Exam ID
const testQuestions = async(req, res) => {
    let lastQuestionStatus
    let pageNumber = parseInt(req.query.pageNumber)
    let ques = await questionDetail.find({ 'examCode': req.headers.examcode }).skip(pageNumber).limit(1).select({"questionImage":1,"questionText": 1, "option1": 1, "option2": 1, "option3": 1, "option4": 1, "examCode": 1, "answerType":1 })
    let lastQuestion = await questionDetail.find({ 'examCode': req.headers.examcode }).select({ "questionText": 1 })
    if (lastQuestion[lastQuestion.length - 1].questionText === ques[ques.length - 1].questionText) lastQuestionStatus = true
    else lastQuestionStatus = false
    const time = await examDetail.find({ 'examCode': req.headers.examcode }).select({ examName: 1, examStartTime: 1, examDuration: 1 })
    res.status(200).send({
        questions: ques,
        lastQuestionStatus: lastQuestionStatus,
        startTime: time[0].examStartTime,
        duration: time[0].examDuration,
        examName: time[0].examName,
        allQuestions: lastQuestion,
        pageNumber: pageNumber
    })
}

//Save Correct Answer to the database when user clicks on Submit Button
const saveCorrectOption = async(req,checkAnswer,existingAnswer)=>{
    if(existingAnswer === null){
        let answerDetail = answerObject(req.body, req.headers, checkAnswer.weightage,true,false)
        await answerDetail.save()
    }
    else{
        let existingScore = await test.findOne({'testCode':req.body.code}).select({totalScore:1})
        let updatedScore = existingScore.totalScore+checkAnswer.weightage
        let existingAnswerStatus = await checkExistingRightOption(req.body.checkedOption,req.body.qId,req.headers.id,updatedScore)
        if(!existingAnswerStatus){
            await test.findOneAndUpdate(
                {$and:[{candidateId:req.headers.id},{testCode:req.body.code}]},
                {   
                    $push: {answers:{answerSubmitted: req.body.checkedOption,questionId: req.body.qId, correctStatus: true}},
                    $set:{totalScore:updatedScore}
                },
                {new: true}
            )
        }
    }
}

//Saving Incorrect Option to the database when user click on submit option
const saveIncorrectOption = async(req,checkAnswer,existingAnswer)=>{
    if(req.body.checkedOption  === undefined) req.body.checkedOption = null
    if(existingAnswer === null){
        let answerDetail = answerObject(req.body,req.headers,0,false,false)
        await answerDetail.save()
    } else {
        let existingScore = await test.findOne({ 'testCode': req.body.code }).select({ totalScore: 1 })
        let updatedScore = existingScore.totalScore - checkAnswer.weightage
        let existingAnswerStatus = await checkExistingWrongOption(req.body.checkedOption, req.body.qId, req.headers.id, updatedScore)
        if (!existingAnswerStatus) {
            await test.findOneAndUpdate({ $and: [{ candidateId: req.headers.id }, { testCode: req.body.code }] }, {
                $push: { answers: { answerSubmitted: req.body.checkedOption, questionId: req.body.qId, correctStatus: false } }
            })
        }
    }
}

const saveCandidateAnswers = async(req, res) => {
    req.body.checkedOption = radioOrCheckBoxValue(req.body)
    let checkAnswer = await questionDetail.findById(req.body.qId).select({ "answer": 1, "weightage": 1 })
  let existingAnswer = await test.findOne({ $and: [{ candidateId: req.headers.id }, { testCode: req.body.code }] })
    if (checkAnswer.answer === req.body.checkedOption) {
        await saveCorrectOption(req, checkAnswer, existingAnswer)
        res.status(200).send({ "msg": "Saved Successfully" })
    } else {
        await saveIncorrectOption(req, checkAnswer, existingAnswer)
        res.status(200).send({ "msg": "Saved Successfully" })
    }
}

const checkAccessKey = async(req, res) => {
    const status = await examDetail.find({ examCode: req.body.examCode })
    if (status.length != 0) {
        return res.status(200).send(status)
    } else return res.status(400).send(status)
}

//Saving all Questions when user clicks on end test button
const saveAllQuestions = async(req,res)=>{
    const allQuestions = await questionDetail.find({examCode:req.headers.examcode}).select({_id:1})
    const savedQuestions = await test.findOne({ $and:[{candidateId:req.headers.id},{testCode:req.headers.examcode}] })
    if(savedQuestions !== null){
        if(savedQuestions.answers.length === allQuestions.length){
            await test.update({$and:[{candidateId:req.headers.id},{testCode:req.headers.examcode}]},{$set:{"submitExam":true}})
        }
    }
    for(let i=0;i<allQuestions.length;i++){
        let existingAnswer = await test.findOne({ $and:[{candidateId:req.headers.id},{testCode:req.headers.examcode}] })
        req.body.qId = allQuestions[i]._id
        req.body.checkedOption = null
        req.body.code = req.headers.examcode    
        if(existingAnswer  === null){
            let answerDetail = answerObject(req.body,req.headers,0,false,true)
            await answerDetail.save()
        }
        else{
            let status = await test.findOne({candidateId:req.headers.id},{answers:{$elemMatch:{questionId:allQuestions[i]._id}}})
            if(status.answers.length === 0){
                await test.findOneAndUpdate(
                    {$and:[{candidateId:req.headers.id},{testCode:req.body.code}]},
                    {
                        $push: {answers:{answerSubmitted: req.body.checkedOption, questionId: req.body.qId, correctStatus: false,submitExam: true}}
                    }
                )
            }
        }
    }
    res.status(200).send({ "msg": "All questions saved" })
}

const getExamTime = async(req,res)=>{
    const examData = await examDetail.findOne({examCode:req.headers.examcode}).select({examStartTime:1})
    const submitStatus = await test.findOne({$and :[{candidateId:req.headers.id},{testCode:req.headers.examcode}]}).select({submitExam:1})
    if(submitStatus === null){
        res.status(200).send({examData,submitStatus:false})
    }
    else{
        res.status(200).send({examData:examData,submitStatus:submitStatus.submitExam})
    }
    
}

const questions = async(req, res) => {
    try {
        let questionInformation = new questionDetail(req.body)
        await questionInformation.save()
        res.status(200).send({ msg: 'question saved successful' })
    } catch (error) {
        res.send({ error })
    }
}

const getQuestionDetails = async(req, res) => {
    
    try {
        let values = await questionDetail.find({ examCode: decodeURIComponent(req.params.examCode) })
        if( values != 0 )
            res.status(200).send(values)
        else
            res.status(404).send('Not Found')
            } catch (error) {
        
    }
}


const fetchQuestionById = async(req, res) => {
    try {
        let obj = await questionDetail.findById({ _id: req.params.id })
        res.status(200).send(obj)

    } catch (error) {
        res.status(404).send(error)
    }
}

const editQuestion = async(req, res) => {
    try {
        await questionDetail.findByIdAndUpdate({ _id: req.params.id },req.body)
        res.status(200).send({ msg: 'question updated' })
    } catch (error) {
        res.status(404).send(error)
    }
}

const removeByExamCode = async(code) => {
    try {
        await questionDetail.remove({ examCode: code })
        return
    } catch (error) {
        console.log(error)
        return
    }
}

const removeQuestion = async(req, res) => {
    try {
        await questionDetail.findByIdAndDelete({ _id: req.params.id })
        res.status(200).send({ msg: 'Question Deleted Successfully' })
    } catch (error) {
        res.status(404).send(error)
    }
}

module.exports = {
    testQuestions,
    saveCandidateAnswers,
    checkAccessKey,
    questions,
    getQuestionDetails,
    removeByExamCode,
    fetchQuestionById,
    editQuestion,
    removeQuestion,
    saveAllQuestions,
    getExamTime
}
