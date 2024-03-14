//1) import admin model
const approvedServiceProvider=require('../model/approvedServiceprovider')
const serverviceProviders=require('../model/serviceproviderSchema')

//import jwt-token to authenticate user
const jwt=require('jsonwebtoken') 

// nodemailer import
const nodemailer = require('nodemailer');


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
                await sendConfirmationEmail(email);
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

// mail send usimg  smtp(simple mail transfer protocol)
async function sendConfirmationEmail(serviceProviderEmail) {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.gmail, // Admin's email
            pass: process.env.gmailpsw // Admin's password
        }
    });
    

    // Send mail with defined transport object
    const  info = await transporter.sendMail({
        from: 'projectmern123@gmail.com', // Admin's email address
        to: [serviceProviderEmail], // Service provider's email address
        subject: 'Service Provider Approval Confirmation',
        text: 'Your request as a service provider has been approved. You can now login to the platform and start offering your services.'
    });

    console.log('Confirmation email sent: ', info.messageId);
}