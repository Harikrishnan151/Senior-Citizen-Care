
//1) import users model

const users=require('../model/userSchema')

//import bcryptjs for hide the password
const bcryptjs = require('bcryptjs');

//import jwt-token to authenticate user
const jwt=require('jsonwebtoken') 


// Logic for user registeration
exports.registerUser=async(req,res)=>{
    console.log('Inside api call for user registeration');
    const {username,email,password,number} =req.body
    const hashedPassword=bcryptjs.hashSync(password, 10)
    try{
        const existingUser=await users.findOne({email:email});
        if(existingUser){
            res.status(406).json({message:'Account already exist'})
        }else{
            const newUser=new users({
                username,email,password:hashedPassword,number
            });
            await newUser.save()
            res.status(200).json({newUser,message:'Account Registered'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Internal server error'})
    }
}

// Logic for User-login
exports.loginUser=async(req,res)=>{
    console.log('Inside API call to login user');
    const{email,password}=req.body
    try{
        const existingUser=await users.findOne({email,password})
        if(existingUser!==null && existingUser!== undefined){
            const token=jwt.sign({
                userid:existingUser._id
            },"superkey2024")
            res.status(200).json({existingUser,token})
        }else{
            res.status(404).json({message:'incorrect email or password'})
        }
    }catch(err){
        res.status(401).json({message:'Account does not exist'}) 
    }
}
