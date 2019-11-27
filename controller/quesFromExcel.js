var { questionDetail } = require('../Models/question')
const excelToJson = require('convert-excel-to-json');

const quesFromExcel = async (req, res) => {
    let path = req.file.filename
    const result = excelToJson({
        sourceFile: 'upload/'+path,
        columnToKey: {
            A: 'questionText',
            B: 'option1',
            C: 'option2',
            D: 'option3',
            E: 'option4',
            F: 'answer',
            G: 'weightage',
            H: 'questionImage',
            I: 'answerType'
        }

    })
    
let i;  
    try {
        if(req.headers.role=="Examiner")
        {
        for(i = 0;i<result.Sheet1.length;i++){

           result.Sheet1[i].examCode = req.body.examCode
           result.Sheet1[i].questionImage=null

        }
        
            await questionDetail.insertMany(result.Sheet1,(err, docs) => {
            if(err){
                res.status(404).send({msg: 'File uploading failed'})
            }
            else{
                res.status(200).send({ msg: 'Data from excel file saved' });
            }
        
      })
    }
    else{
        res.status(401).send('authorized')
    }
    } catch (err) {
        console.log(err)
    }
    
}




module.exports = {
    quesFromExcel
}