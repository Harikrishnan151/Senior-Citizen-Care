//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection 
const categorySchema=new mongoose.Schema({
    category: {
        type:String,
        required:true
        
    },
    subcategory:{
        type:[
           
        ]
    }
  
})