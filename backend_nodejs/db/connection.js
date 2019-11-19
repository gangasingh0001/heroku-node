// const {MONGO_HOSTNAME,MONGO_PORT, MONGO_DB} = require('./keys')
 const mongoose = require('mongoose')
// const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
// mongoose.connect(url,{useNewUrlParser: true, useCreateIndex: true})

// mongoose.connection.once('open',()=>{
//     console.log('Mongoose Connection is Successful')
// }).on('error',(error)=>{
//     console.log('Connection erorr : ',error)
// })

var MongoClient = require('mongodb').MongoClient;

  mongoose.connect("mongodb+srv://node-examportal:node-examportal@node-exam-portal-9ma4e.mongodb.net/test?retryWrites=true&w=majority", {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(err.message);
});
// });