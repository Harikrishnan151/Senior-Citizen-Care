//import express
const express=require('express')

//2) import controllers
const userController=require('../controller/userController')

//4) import verifyUser.js file
const {verifyUser} =require('../utlis/verifyUser')

//3) Using express create a object for router class in order to setpath
const router=new express.Router()

//Backend API calls

//Register API call
router.post('/user/register',userController.registerUser)

//Login API call
router.post('/user/login',userController.loginUser)

//Google sign-in API call
router.post('/google',userController.googleLogin)

//Logout API call
router.get('/logout',userController.singnOut)

//Delete user API call
router.delete('/deleteUser/:id', userController.deleteUser);

//
//4) export routes
module.exports=router

