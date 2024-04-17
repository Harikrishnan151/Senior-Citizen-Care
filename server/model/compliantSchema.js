//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const complaintSchema = new mongoose.Schema({
    userId: {
        type: String,
       
    },
    adminId:{
        type:String,
        
    },
    message:{
        type:String,
        required:true
       
    },


})

//3) Create a model to store user
const complaintRequest= mongoose.model('complaintRequest',complaintSchema)

//4) Export model
module.exports=complaintRequest