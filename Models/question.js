const mongoose  = require('mongoose');
delete mongoose.connection.models['question'];
const Schema = mongoose.Schema

const questionDetails = new Schema({
	questionText: String,
	answer: String,
		option1: String,
		option2: String,
		option3: String,
		option4: String,
	weightage: Number,
	createdDate: {
		type: Date,
		default: Date.now
	},
	createdBy:String,
	modifiedDate: {
		type: Date,
		default: Date.now
	},
	modifiedBy:String,
	examCode: String,
	answerType:String,
	questionImage:{
		type: String,
	}
})

const questionDetail = mongoose.model('question',questionDetails)

module.exports = {
	questionDetail
}