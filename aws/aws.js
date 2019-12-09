const fs = require('fs')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: "AKIAJ532WJCUCNQPPYBQ",
    secretAccessKey: "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"
})
const uploadFile = async ( req )=>{
    //console.log(file)
    // return ;
    const fst = await fs.createReadStream(req.file.path)
    const params = {
         Bucket: 'examportal', // pass your bucket name
         Key: req.file.filename, // file will be saved as testBucket/contacts.csv
         Body: fst,
         ACL: 'public-read'
     }
    const test = await s3.upload( params)
     const {Location} = await test.promise();
     req.body['questionImage'] = Location;
}
module.exports = {uploadFile}