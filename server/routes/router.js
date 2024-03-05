//import express
const express=require('express')

//2) import controllers
const userController=require('../controller/userController')
const adminController=require('../controller/adminController')
const serviveproviderController=require('../controller/serviceproviderController')
const approvedServiceProvider=require('../controller/approvedServiceController')

//import certificate multer file
const upload=require('../multer/storageConfig')

//import image multer file
const uploadImg=require('../multer/storageConfigImg')
const uploadPDF = require('../multer/storageConfig')



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

//Edit user API call
router.post('/editUser/:id',userController.editUser)

//Admin Login API call
router.post('/adminLogin',adminController.adminLogin)

//serviceProvider primary registeration API call
router.post('/serviceProvier/register',uploadPDF.single('experience_crt'),serviveproviderController.serviceProviderRegisteration)

//serviceProvider secondary registration API call
router.post('/serviceProvider/fianlRegtration',uploadImg.single('profile_img'),serviveproviderController.finalReg)

//Get all service providers list inside the admin dashboard to approve 
router.get('/allServiceProviders/list',adminController.getAllserviceproviders)

//Api to approve service provider request
router.post('/approve/serviceProvider',approvedServiceProvider.approveServiceProvider)

//Service Provider login
router.post('/serviceProvider/login',approvedServiceProvider.serviceProviderLogin)

//4) export routes
module.exports=router

