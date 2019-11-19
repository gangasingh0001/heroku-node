const examController = require('./examDetailController')
const questionDetail = require('./questionController')
const studentPerformanceController = require('./studentPerformance')
const userController = require('./userRecord')
const bcryptjs = require('bcryptjs')
const testInfo = require('./testDetails')
const questionFromExcel = require('./quesFromExcel')

const userRecord = async(req, res) => {

  const response = await userController.userRecord(req, res)
    return response
}


const viewExamDetail = (req, res) => {
    examController.viewExamDetail(req, res)
}

const fetchExamDetail = (req, res) => {
    examController.fetchExamDetail(req, res)
}

const removeExam = (req, res) => {
    examController.removeExam(req, res)
}

const loggedInDetails = async(req, res) => {
    const det = await userController.loggedInDetails(req, res)
    return det
}

const question = (req, res) => {
    questionDetail.questions(req, res)
}
const quesFromExcel = (req, res) => {
    
     questionFromExcel.quesFromExcel(req, res)
}

const examDetail = (req, res) => {
    examController.examDetails(req, res)
}

const studentPerformance = async(req, res) => {

    const response = await studentPerformanceController.allExamsMade(req, res)
    return response

}

const adminLogin = async(req, res) => {

    const result = await userController.adminLogin(req, res)
    return result;
}
const userDetails = (req, res) => {
    const data = userController.userDetails(req, res)
    return data;
}

const editExam = (req, res) => {
    examController.editExam(req, res)
}

const getQuestionDetail = (req, res) => {
    questionDetail.getQuestionDetails(req, res)
}
const addQuestion = (req, res) => {
    
    examController.addQuestion(req, res)
}

const fetchQuestionById = (req, res) => {
    questionDetail.fetchQuestionById(req, res)
}

const editQuestion = (req, res) => {
    questionDetail.editQuestion(req, res)
}
const removeQuestion = (req, res) => {
        questionDetail.removeQuestion(req, res)
    }
   

const testDetails = (req, res) => {
    const result = testInfo.testDetails(req, res)
    return result;
}

const examinerDelete = (req, res) => {
    const result = testInfo.examinerDelete(req, res)
    return result
}
const fetchData = (req, res) => {
    const result = userController.fetchData(req, res)
    return result
}

const examinerUpdate = (req, res) => {
    const result = userController.examinerUpdate(req, res)
    return result
}
const studPerformance = async(req, res) => {
    const result = await studentPerformanceController.studPerformance(req, res);
    return result;
}
const updateUser = (req, res) => {
    const data = userController.updateuser(req, res)
    return data;
}
const adminDetails = (req, res) => {
    const data = userController.adminDetails(req, res)
    return data;
}


module.exports = {
    adminDetails,
    updateUser,
    examinerUpdate,
    examinerDelete,
    fetchData,
    testDetails,
    removeExam,
    viewExamDetail,
    fetchExamDetail,
    removeQuestion,
    fetchQuestionById,
    getQuestionDetail,
    editExam,
    editQuestion,
    quesFromExcel,
    studPerformance,
    userDetails,
    adminLogin,
    loggedInDetails,
    userRecord,
    examDetail,
    question,
    studentPerformance,
    addQuestion
}
