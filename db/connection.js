const {MONGO_HOSTNAME,MONGO_PORT, MONGO_DB} = require('./keys')
const mongoose = require('mongoose')
const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
mongoose.connect(url,{useNewUrlParser: true, useCreateIndex: true})

mongoose.connection.once('open',()=>{
    console.log('Mongoose Connection is Successful')
}).on('error',(error)=>{
    console.log('Connection erorr : ',error)
})

module.exports = {
    mongoose
}