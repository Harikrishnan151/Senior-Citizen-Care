//import express
const express=require('express')

//2) import controllers
const userController=require('../controller/userController')

//3) Using express create a object for router class in order to setpath
const router=new express.Router()

//Backend API calls

//Register API call
router.post('/user/register',userController.registerUser)

//Login API call
router.post('/user/login',userController.loginUser)

//4) export routes
module.exports=router

