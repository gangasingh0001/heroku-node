const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://node-examportal:node-examportal@node-exam-portal-9ma4e.mongodb.net/test?retryWrites=true&w=majority", {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(err.message);
});