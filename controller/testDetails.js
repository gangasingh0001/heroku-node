const { user } = require('../models/userRecord')
const {examDetais} =require('../models/examDetail')
const testDetails= async(req,res)=>{
    try{
        
        const query=await examDetais.findOne(req.body._id)
        //console.log(query)
           return query;
        }
        catch(error)
        {
            return("No test")
        }
        
    }
const examinerDelete= async(req,res)=>{
    try{
        
    const query=await user.findByIdAndDelete(req.body._id)
    
    return("User deleted")
    }
    catch(error)
    {
        return("not able to find ")
    }
}
    module.exports={
        testDetails,
        examinerDelete,
    }