const mongoose = require('mongoose')
delete mongoose.connection.models['candidateAnswer']

const Schema = mongoose.Schema

const candidateAnswer = new Schema({
    candidateId: String,
    totalScore: Number,
    testCode: String, //Must be unique 
    completionTime: {
        type: Date,
        default: Date.now
    },
    answers: [{
        correctStatus: Boolean,
        answerSubmitted: String,
        questionId: String
    }],
    submitExam: {
        type: Boolean,
        default: false
    }
})

const test = mongoose.model('candidateAnswer', candidateAnswer)

module.exports = {
    test
}