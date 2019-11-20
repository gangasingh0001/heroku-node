const { test } = require('../models/candidateAnswer')

//Check if user have submit the same correct option again and update the database
const checkExistingRightOption = async(option, qId, studentId, updatedScore) => {
    let status = await test.findOne({ candidateId: studentId }, { answers: { $elemMatch: { questionId: qId } } })
    if (status.answers.length !== 0) {
        if (status.answers[0].correctStatus) {
            await test.update({
                $and: [
                    { answers: { $elemMatch: { questionId: qId } } },
                    { candidateId: studentId }
                ]
            }, {
                $set: {
                    "answers.$.answerSubmitted": option,
                }
            })
        } else {
            await test.update({
                $and: [
                    { answers: { $elemMatch: { questionId: qId } } },
                    { candidateId: studentId }
                ]
            }, {
                $set: {
                    "answers.$.answerSubmitted": option,
                    "answers.$.correctStatus": true,
                    "totalScore": updatedScore
                }
            })
        }
        return true
    }
    return false
}


//Check if user have submit the wrong correct option again and update the database
const checkExistingWrongOption = async(option, qId, studentId, updatedScore) => {
    let status = await test.findOne({ candidateId: studentId }, { answers: { $elemMatch: { questionId: qId } } })
    if (status.answers.length !== 0) {
        if (status.answers[0].correctStatus) {
            await test.update({
                $and: [
                    { answers: { $elemMatch: { questionId: qId } } },
                    { candidateId: studentId }
                ]
            }, {
                $set: {
                    "answers.$.answerSubmitted": option,
                    "answers.$.correctStatus": false,
                    "totalScore": updatedScore
                }
            })
        } else {
            await test.update({
                $and: [
                    { answers: { $elemMatch: { questionId: qId } } },
                    { candidateId: studentId }
                ]
            }, {
                $set: {
                    "answers.$.answerSubmitted": option,
                }
            })
        }
        return true
    }
    return false
}

const radioOrCheckBoxValue = (value)=>{
    if(value.checkedOption.length == 1){
        var joinValue = value.checkedOption.join()
    }
    else{
        var joinValue = value.checkedOption.join()
        joinValue  = joinValue.replace(/[ ,.]/g,' ')
    }
    return joinValue
}

module.exports = {
    checkExistingRightOption,
    checkExistingWrongOption,
    radioOrCheckBoxValue
}