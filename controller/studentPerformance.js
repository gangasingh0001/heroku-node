// const examDetail = require('../models/examDetail')
const { test } = require('../models/candidateAnswer')
const { user } = require('../models/userRecord')
const { examDetail } = require('../models/examDetail')
const { questionDetail } = require('../models/question')
const studPerformance = async(req, res) => {
    try {
        // debugger
        console.log('_________________')
            // console.log(req.headers.studentid)
         
        const examId = req.headers.examid

        let sum = await questionDetail.aggregate([{$match:{examCode:examId}},
            {$group:{_id:null,total:{$sum:"$weightage"}}}])
            console.log(sum[0].total)
        const result = await test.find({ "testCode": examId }).sort({ "candidateId": '1' })
            console.log(result)
            // while (i < result.length) {
            //     var studs = []
            //     studs.push(result[i].candidateId)
            // }
        var i = 0
        var len = result.length
        var studs = []
        while (i < len) {
            const id1 = result[i].candidateId;
            const idDetails = await user.findById(id1).sort({ "_id": '1' })
                // console.log(idDetails)
            studs.push(idDetails);
            i++;
        }
        // const sortedStud = studs.sort({ '_id': '1' })
        // studs.sort()
        console.log(studs)
        //console.log(id)
        //console.log(result)
        //   return idDetails
        res.send({ a: studs, b: result, c:sum[0].total})
            //let testRecord = await test.find()({ "candidateId": '1' })

    } catch (error) {
        res.send(error)

    }
}
const allExamsMade = async(req, res) => {
    try {
        //console.log(req.headers.token)
        debugger

        let exams = await examDetail.find({ "examinerId": req.headers.id })


        // console.log(exams)

        return exams

    } catch (error) {
        res.send(error)
    }
}
const viewPerformance = async(req, res) => {

    try {
        let candidateRecord = await user.find({ accountType: 'Student' }).sort({ "_id": '1' })
            // let sortedvalues2 = values2.sort({ "_id": '1' })
            // console.log(candidateRecord)
        res.send({ a: testRecord, b: candidateRecord })
    } catch (error) {
        res.send(error)
    }
}
module.exports = {
    viewPerformance,
    studPerformance,
    allExamsMade
}