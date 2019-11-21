const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://ashishrawat:ashish@node-exam-portal-9ma4e.mongodb.net/test?retryWrites=true&w=majority", {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(err.message);
});