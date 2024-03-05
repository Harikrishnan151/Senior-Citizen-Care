//1) import admin model
const approvedServiceProvider=require('../model/approvedServiceprovider')
const serverviceProviders=require('../model/serviceproviderSchema')

//import jwt-token to authenticate user
const jwt=require('jsonwebtoken') 


//Logic to approve serviceProvider
exports.approveServiceProvider=async(req,res)=>{
    console.log('inside Api call to approve service provider');
    const {username,email,password,mobile,profile_img,service,specialization,qualification,experience_crt,exp_year,rate}=req.body
    try{
        const serviceProvider=await approvedServiceProvider.findOne({email:email})
        if(serviceProvider){
            res.status(401).json({message:'service provider already approved'})
        }else{
            const newServiceProvider=new approvedServiceProvider({
                username,email,password,mobile,profile_img,service,specialization,qualification,experience_crt,exp_year,rate 
            })
            newServiceProvider.save()

            const response=await serverviceProviders.findOne({email:email})
            if(response){
                const result=await serverviceProviders.deleteOne({email})
                res.status(200).json({newServiceProvider,message:"Service Provider approved"})
            }else{
                res.status(404).json({message:'Approval Faild'})
            }
        }

    }catch(error){
        res.status(500).json({message:'internal server error'})
    }
}

//Logic for approved service provider login
exports.serviceProviderLogin=async(req,res)=>{
    console.log('inside api call to login service provider');
    const {email,password}=req.body
    console.log(email);
    console.log(password);
      try{
        const existingUser=await approvedServiceProvider.findOne({email,password})
        if(existingUser!==null && existingUser!==undefined){
            const token=jwt.sign({
                serviceProviderid:existingUser._id
            },'superkey2024')
            res.status(200).json({existingUser,token,message:'Login Sucessfull'})
        }else{
            res.status(404).json({message:'Incorrect email or password'}) 
        }
      }catch(error){
        res.status(500).json({message:'Request not approved by the Admin'})
      }
}