const { examDetail } = require('../Models/examDetail')
const { test } = require('../Models/candidateAnswer')
const { questionDetail } = require('../Models/question')
const { user } = require('../Models/userRecord')
const db = require("../db").connection;
const users = [
    {
        "name": "Himanshu Chauhan",
        "email": "himanshu@gmail.com",
        "phoneNumber": "true",
        "password": "$2a$10$x/t9dmt1xkBZUiFWvA1yuusFETuJU4ITN4CwJtHIOT/o1cc.XAar6",
        "accountType": "Student"
    },
    {
        "name": "chandan chandan",
        "email": "chandan@gmail.com",
        "phoneNumber": "true",
        "password": "$2a$10$qy6lrCUZGNhmIcZrT2WCzu9vEtnO3Ot8IGgRD9FcI1s76k1PThXUS",
        "accountType": "Student"
    },
    {
        "name": "admin admin",
        "email": "admin@gmail.com",
        "phoneNumber": "true",
        "password": "$2a$10$WdiHxUwxtbis02QvS48DTuelHGnqBFZV0yn6Z6WyrxocXmFrNbuby",
        "accountType": "Admin"
    },
    {
        "name": "ashish rawat",
        "email": "ashish@cygrp.com",
        "phoneNumber": "true",
        "password": "$2a$10$Dunvtla2BIO30DXVU20YnuuFkxr/9FBEA4v2lGwHrg9m7kQlc5td.",
        "accountType": "Examiner "
    }
]

const answerDetails = [
    {
        "submitExam": true,
        "candidateId": "5dc4f2c09b294932e016d68e",
        "totalScore": 0,
        "testCode": "1199",
        "answers": [
            {
                "answerSubmitted": null,
                "questionId": "5dc3ac119f45c42f54f44896",
                "correctStatus": false
            },
            {
                "answerSubmitted": null,
                "questionId": "5dc3ac119f45c42f54f44895",
                "correctStatus": false
            },
            {
                "answerSubmitted": null,
                "questionId": "5dc3ac119f45c42f54f44897",
                "correctStatus": false
            },
            {
                "answerSubmitted": null,
                "questionId": "5dc3ac119f45c42f54f44898",
                "correctStatus": false
            },
            {
                "answerSubmitted": null,
                "questionId": "5dc3ac119f45c42f54f44894",
                "correctStatus": false
            }
        ]
    },
    {
        "submitExam": true,
        "candidateId": "5dc3f12eb918c824d896842c",
        "totalScore": 5,
        "testCode": "1199",
        "answers": [
            {
                "answerSubmitted": "option1 option3",
                "questionId": "5dc3ac119f45c42f54f44896",
                "correctStatus": true
            },
            {
                "answerSubmitted": "option3 option4",
                "questionId": "5dc3ac119f45c42f54f44895",
                "correctStatus": false
            },
            {
                "answerSubmitted": "option1 option2",
                "questionId": "5dc3ac119f45c42f54f44897",
                "correctStatus": false
            },
            {
                "answerSubmitted": "option2 option4",
                "questionId": "5dc3ac119f45c42f54f44898",
                "correctStatus": true
            },
            {
                "answerSubmitted": "option1 option2 option3",
                "questionId": "5dc3ac119f45c42f54f44894",
                "correctStatus": true
            }
        ]
    }
]

const questionDetails = [
    {
        "questionImage": "../assets/main.jpg",
        "questionText": "Which of the following is not an example of system software?",
        "answer": "option1 option3",
        "option1": "Language Translator",
        "option2": "Utility Software",
        "option3": "Communication Software",
        "option4": "Word Processors",
        "weightage": 1,
        "createdBy": "himan",
        "examCode": "1199",
        "answerType": "multipleOption"
    },
    {
        "questionImage": null,
        "questionText": "Which of the following is designed to control the operations of a computer?",
        "answer": "option1 option2",
        "option1": "Application Software",
        "option2": "System Software",
        "option3": "Utility Software",
        "option4": "User",
        "weightage": 1,
        "createdBy": "himan",
        "examCode": "1199",
        "answerType": "multipleOption"
    },
    {
        "questionImage": null,
        "questionText": "What is the full form of RMI?",
        "answer": "option3 option4",
        "option1": "Remote Memory Installation",
        "option2": "Remote Memory Invocation",
        "option3": "Remote Method Installation",
        "option4": "Remote Method Invocation",
        "weightage": 2,
        "createdBy": "himan",
        "examCode": "1199",
        "answerType": "multipleOption",
    },
    {
        "questionImage": "../assets/preview1.jpg",
        "answer": "option2 option4",
        "option1": "allowing a job to use the processor",
        "option2": "making proper use of processor",
        "option3": "all of the mentioned",
        "option4": "none of the mentioned",
        "weightage": 3,
        "createdBy": "himan",
        "examCode": "1199",
        "questionText": "What is Scheduling?"
    },
    {
        "questionImage": "../assets/preview.jpg",
        "questionText": "The physical devices of a computer ",
        "answer": "option1 option2 option3",
        "option1": "Software",
        "option2": "Package",
        "option3": "Hardware",
        "option4": "System Software",
        "weightage": 1,
        "createdBy": "himan",
        "examCode": "1199",
        "answerType": "multipleOption"
    }

]

const examDetails = [
    {
        "examName": "CSE",
        "examCode": "1199",
        "examinerId": "1234",
        "instructions": "no instructions",
        "examDuration": "240",
        "examStartTime": "2019-11-08 10:13:00"
    },
{
        "examName": "chemistry",
        "examCode": "0000",
        "examDuration": "90",
        "examStartTime": "2019-11-06 15:10:00",
        "instructions": "no instructions",
        "examinerId": "5dc0ff27b29b8218244aa6c4"
    },
{
        "examName": "Check Box",
        "examCode": "1234",
        "examDuration": "240",
        "examStartTime": "2019-11-06 19:10:00",
        "instructions": "no insttructions",
        "examinerId": "5dc0ff27b29b8218244aa6c4"
    },
{
        "examName": "Data Structure",
        "examCode": "9876",
        "examDuration": "240",
        "examStartTime": "2019-11-06 19:19:00",
        "instructions": "no ",
        "examinerId": "5dc0ff27b29b8218244aa6c4"
    }
]


for (let i = 0; i < users.length; i++) {
    let data = new user(users[i])
    data.save()
}

// for (let i = 0; i < answerDetails.length; i++) {
//     let data = new test(answerDetails[i])
//     data.save()
// }

// for (let i = 0; i < questionDetails.length; i++) {
//     let data = new questionDetail(questionDetails[i])
//     data.save()
// }

// for (let i = 0; i < examDetails.length; i++) {
//     let data = new examDetail(examDetails[i])
//     data.save()
// }