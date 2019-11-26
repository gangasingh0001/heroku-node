const { examDetail } = require('../Models/examDetail')
const question = require('./questionController')

const examDetails = async(req, res) => {
    try {
        if(req.headers.role=="Examiner")
        {
    

        const checkExamCode = await examDetail.findOne({ examCode: req.body.examCode })
        if (checkExamCode != null) {
            res.status(409).send({ message: "Exam Code already exist" })
        } else {
            req.body.examinerId = req.headers.id
            let examInformation = new examDetail(req.body)
            await examInformation.save()
            res.status(200).send({ message: 'exam information saved successful' })
        }
    }
    else{
        req.status(401).send('unauthorized')
    }
    
    } catch (error) {
        console.log('error ', error)
        res.status(500).send(error)
    }
}

const viewExamDetail = async(req, res) => {
    try {
        if(req.headers.role=="Examiner")
        {
        let values = await examDetail.find({ examinerId: req.headers.id })
        if (values.length != 0) {
            res.status(200).send(values)
        } else
            res.status(404).send('No Exam')
    }
    else{
        res.status(401).send("unauthorized")
    }
    } catch (error) {
        console.log(error)
    }
}
const removeExam = async(req, res) => {
    try {
        if(req.headers.role=="Examiner")
        {
        let deleteExam = await examDetail.findById({ _id: req.params.id })
        question.removeByExamCode(deleteExam.examCode)
        await examDetail.findByIdAndDelete({ _id: req.params.id })
        res.status(200).send({ msg: 'exam deleted' })
    


    }
else{
    res.status().send("unauthorized")
}
    }
catch (error) {
        res.status(404).send(error)
    }

}

const editExam = async(req, res) => {
    try {
        if(req.headers.role=="Examiner")
        {
        await examDetail.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                "examName": req.body.examName,
                "instructions": req.body.instructions,
                "examDuration": req.body.examDuration,
                "examStartTime": req.body.examStartTime
            }
        })
    }
    else{
        res.status(401).send('unauthorized')
    }
        res.status(200).send({ msg: 'exam detail updated' })
    } catch (error) {
        res.status(400).send(error)
    }
}
const fetchExamDetail = async(req, res) => {
    try {
        if(req.headers.role=="Examiner")
        {
        let obj = await examDetail.findById({ _id: req.params.id })
        res.status(200).send(obj)
        }
        else{
            res.status(401).send('unauthorized')
        }
    } catch (error) {
       
        res.status(404).send(error)
    }
}
const addQuestion = async(req, res) => {
    try {
       
        let values = await examDetail.findById(req.query.examinerId); 
        console.log(values);
        res.status(200).send(values)
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    examDetails,
    viewExamDetail,
    removeExam,
    fetchExamDetail,
    editExam,
    addQuestion
}