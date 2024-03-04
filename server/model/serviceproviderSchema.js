//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const serviceproviderSchema=new mongoose.Schema({
    username:{
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    profile_img: {
        type: String,
        
    },
    service: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience_crt: {
        type: String
        // required: true,
    },
    exp_year: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
   status: {
        type: String,
    
    },
})

//3) Create a model to store user
const serviceProvider=mongoose.model('serviceProvider',serviceproviderSchema)

//4) Export model
module.exports=serviceProvider