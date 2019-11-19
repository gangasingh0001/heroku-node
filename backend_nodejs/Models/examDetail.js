const mongoose = require('mongoose')

const Schema = mongoose.Schema
delete mongoose.connection.models['exam'];

const exam = new Schema({
    examName: String,
    examCode: String,
    examinerId: String,
    examDuration: String,
    examStartTime: String,
})

const examDetail = mongoose.model('exam', exam)

module.exports = {
    examDetail
}
